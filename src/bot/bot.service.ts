import { Composer, Context, Markup, Scenes, Telegraf } from "telegraf";
import { ConfigKeys } from "../config/config-keys";
import { inject, injectable } from "inversify";
import { IConfig } from "../config/config.interface";
import { ContainerTypes } from "../container-types";
import { ParserService } from "../parser/parser.service";
import { UserService } from "../user/user.service";
import LocalSession from "telegraf-session-local";
import { ProductUrlTypes } from "../product-url/product-url-types";
import { productUrlHostRecord } from "../product-url/product-url-host-record";
import { WizardSession } from "telegraf/typings/scenes";
import { Product } from "../product/product";
import { ProductUrl } from "../product-url/product-url";
import { ProductService } from "../product/product.service";
import { ProductUrlService } from "../product-url/product-url.service";

// TODO: add menu command

export enum ActionList {
  PRODUCT_LIST = "PRODUCT_LIST",
  ENTER_ADD_PRODUCT_WIZARD = "ENTER_ADD_PRODUCT_WIZARD",
  // TODO: add delete
  DELETE_PRODUCT = "DELETE_PRODUCT",
}

export const generalActionsKeyboard = Markup.inlineKeyboard([
  Markup.button.callback("Список товаров", ActionList.PRODUCT_LIST),
  Markup.button.callback("Добавить товар", ActionList.ENTER_ADD_PRODUCT_WIZARD),
]);

export enum ScenesList {
  GENERAL = "GENERAL",
  ADD_PRODUCT = "ADD_PRODUCT",
}

/**
 * We can extend the regular session object that we can use on the context.
 * However, as we're using wizards, we have to make it extend `WizardSession`.
 */
interface MySession extends WizardSession {
  product: Partial<Product>;
  productUrl: Partial<ProductUrl>;
}

interface MyContext extends Context {
  session: MySession;
  scene: Scenes.SceneContextScene<MyContext, Scenes.WizardSessionData>;
  wizard: Scenes.WizardContextWizard<MyContext>;
}

@injectable()
export class BotService {
  constructor(
    @inject(ContainerTypes.Config) private readonly config: IConfig,
    @inject(ContainerTypes.ParserService) private readonly parserService: ParserService,
    @inject(ContainerTypes.UserService)
    private readonly userService: UserService,
    @inject(ContainerTypes.ProductService)
    private readonly productService: ProductService,
    @inject(ContainerTypes.ProductUrlService)
    private readonly productUrlService: ProductUrlService,
  ) {
    const bot = new Telegraf<MyContext>(config.get(ConfigKeys.TG_TOKEN));

    const generalScene = new Scenes.BaseScene<MyContext>(ScenesList.GENERAL);

    // TODO: убрать пустые шаги с текстом, объединить их с шагами с текстом при помощи Composer?
    const addProductScene = new Scenes.WizardScene<MyContext>(
      ScenesList.ADD_PRODUCT,
      async (ctx) => {
        ctx.session.product = {};
        ctx.reply("Введите название товара:");
        ctx.wizard.next();
      },
      async (ctx) => {
        if (!ctx.message || !("text" in ctx.message)) {
          return;
        }

        ctx.session.product.name = ctx.message?.text;

        ctx.session.productUrl = {};
        ctx.reply(
          "Выберите магазин:",
          Markup.inlineKeyboard([Markup.button.callback("Глобус", String(ProductUrlTypes.GLOBUS))]),
        );
        ctx.wizard.next();
      },

      Composer.action([String(ProductUrlTypes.GLOBUS)], (ctx) => {
        if (!("data" in ctx.update.callback_query)) {
          return;
        }
        ctx.session.productUrl.typeId = Number(ctx.update.callback_query.data);
        ctx.reply("Введите ссылку на товар:");
        ctx.wizard.next();
      }),
      async (ctx) => {
        if (!ctx.message || !("text" in ctx.message) || !ctx.session.productUrl.typeId) {
          return;
        }
        try {
          const url = new URL(ctx.message.text);
          if (!productUrlHostRecord[ctx.session.productUrl.typeId].includes(url.hostname)) {
            return ctx.reply("Введенная ссылка не на указанный магазин, попробуй снова.");
          }

          ctx.session.productUrl.url = url.toString();

          if (!ctx.from) {
            return;
          }

          const user = await userService.getByTgId(ctx.from.id);

          if (!user) {
            return;
          }

          const product = await productService.create({ ...ctx.session.product, userId: user.id });

          await productUrlService.create({ ...ctx.session.productUrl, productId: product.id });

          await ctx.reply(`Продукт "${product.name}" успешно добавлен`);

          ctx.scene.enter(ScenesList.GENERAL);
        } catch (e: unknown) {
          console.error(e);
          if (e instanceof Error && "code" in e && e?.code === "ERR_INVALID_URL") {
            return ctx.reply("Некорректный url, попробуй снова.");
          }

          ctx.reply(`Произошла ошибка: ${JSON.stringify(e)}`);
        }
      },
    );

    generalScene.enter((ctx) => {
      ctx.reply("Выбери действие: ", generalActionsKeyboard);
    });

    generalScene.action(ActionList.ENTER_ADD_PRODUCT_WIZARD, (ctx) => {
      ctx.scene?.enter(ScenesList.ADD_PRODUCT);
    });

    generalScene.action(ActionList.PRODUCT_LIST, async (ctx) => {
      try {
        const user = await userService.getByTgId(ctx.from.id);
        const productList = await productService.findProduct({ userId: user.id });

        if (productList.length === 0) {
          await ctx.reply("Продуктов пока нет");
          return ctx.scene.enter(ScenesList.GENERAL);
        }
        ctx.reply(
          productList.reduce(
            (acc: string, product, index) => acc + `\n${index + 1}. ${product.name}`,
            "Ваши продукты: ",
          ),
          Markup.inlineKeyboard([
            Markup.button.callback("Удалить товар", ActionList.DELETE_PRODUCT),
            Markup.button.callback("Добавить товар", ActionList.ENTER_ADD_PRODUCT_WIZARD),
          ]),
        );
      } catch (e) {
        console.error(e);
        ctx.reply("Произошла ошибка, попробуйте снова");
      }
    });

    const stage = new Scenes.Stage<MyContext>([generalScene, addProductScene], {
      default: ScenesList.GENERAL,
    });

    bot.start(async (ctx) => {
      try {
        let user = await userService.getByTgId(ctx.from.id);
        if (!user) {
          user = await userService.create({ tgId: ctx.from.id });
        }
        return ctx.reply("Выбери действие: ", generalActionsKeyboard);
      } catch (e) {
        console.error(e);
        ctx.reply("Ошибка");
      }
    });

    bot.use(new LocalSession({ database: "example_db.json" }).middleware());
    bot.use(stage.middleware());

    bot.launch();
  }
}

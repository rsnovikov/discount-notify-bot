-- drop table product_prices;

create table product_prices (
	id serial primary key,
	price numeric(10, 2) check(price > 0) not null,
	product_url_id bigint not null, 
	created_at timestamptz default now(),
	FOREIGN KEY (product_url_id) REFERENCES product_urls (id)
);

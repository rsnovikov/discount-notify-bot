-- drop table product_urls;

create table product_urls (
	id serial primary key,
	type_id smallint check(type_id in (1)), -- 1 - globus
	url varchar(255) not null,
	created_at timestamptz default now(),
	product_id bigint not null, 
	FOREIGN KEY (product_id) REFERENCES products (id)
);

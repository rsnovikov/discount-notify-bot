-- drop table products;

create table products (
	id serial primary key,
	name varchar(64) not null,
	created_at timestamptz default now(),
	user_id bigint not null, 
	FOREIGN KEY (user_id) REFERENCES users (id)
);

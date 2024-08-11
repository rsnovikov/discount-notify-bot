-- drop table users;

create table users (
	id serial primary key,
	tg_id bigint not null unique,
	created_at timestamptz default now()
);

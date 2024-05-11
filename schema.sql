CREATE TABLE movie (
    id SERIAL PRIMARY KEY,
    original_title varchar(1000),
    release_date DATE,
    poster_path varchar(1000),
    overview varchar(1000),
    comment varchar(1000)
);
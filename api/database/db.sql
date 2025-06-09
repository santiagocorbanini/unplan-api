CREATE TABLE shows (
show_id SERIAL PRIMARY KEY,
title VARCHAR(255),
venue VARCHAR(255),
event_date DATE,
city VARCHAR(255),
url VARCHAR(255),
end_date TIMESTAMP,
start_date TIMESTAMP,
completedevent BOOLEAN DEFAULT(FALSE),
flyer VARCHAR(255)
);

SELECT * from SHOWS;

ALTER TABLE shows
ALTER COLUMN flyer TYPE BYTEA USING flyer::bytea;

ALTER TABLE shows
ADD COLUMN categories VARCHAR(255)[];
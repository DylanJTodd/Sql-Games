CREATE TABLE Honeycomb (
    id SERIAL PRIMARY KEY,
    Shape VARCHAR(255),
    Difficulty SMALLINT,
    iswet BOOLEAN
);

CREATE TABLE Solution (
    "user" INTEGER,
    Value TEXT
);
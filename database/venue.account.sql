DROP TABLE IF EXISTS account, account_identity, account_sensible_text, account_sensible_blob, account_general_text, account_general_blob;
CREATE TABLE account (
    id_generic TEXT  UNIQUE NOT NULL , -- can be updated
    id_account UUID DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    created TIMESTAMPTZ DEFAULT  now() NOT NULL,
	updated TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE TABLE account_identity (
    id_account_identity UUID DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    id_account UUID NOT NULL  REFERENCES account(id_account) ON DELETE CASCADE ON UPDATE CASCADE,
    lastname TEXT NOT NULL, -- can be updated
    firstname TEXT NOT NULL, -- can be updated
    created TIMESTAMPTZ DEFAULT  now() NOT NULL,
	updated TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE account_sensible_text (
    id_account_sensible_text UUID DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    id_account UUID NOT NULL REFERENCES account(id_account) ON DELETE CASCADE ON UPDATE CASCADE,
    category TEXT NOT NULL, -- can be updated
    info TEXT NOT NULL, -- can be updated
    created TIMESTAMPTZ DEFAULT  now() NOT NULL,
	updated TIMESTAMPTZ DEFAULT now() NOT NULL,
	CONSTRAINT unique_id_account_category_account_sensible_text UNIQUE (id_account, category)
);

CREATE TABLE account_sensible_blob (
    id_account_sensible_blob UUID DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    id_account UUID NOT NULL REFERENCES account(id_account) ON DELETE CASCADE ON UPDATE CASCADE,
    type TEXT CHECK (type IN ('image', 'video', 'audio', 'text', 'document')) NOT NULL, -- can be updated
	category TEXT NOT NULL, -- can be updated
    blob OID NOT NULL, -- can be updated
    created TIMESTAMPTZ DEFAULT  now() NOT NULL,
	updated TIMESTAMPTZ DEFAULT now() NOT NULL,
	CONSTRAINT unique_id_account_category_account_sensible_blob UNIQUE (id_account, category)
);

CREATE TABLE account_general_text (
    id_account_general_text UUID DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    id_account UUID NOT NULL REFERENCES account(id_account) ON DELETE CASCADE ON UPDATE CASCADE,
    category TEXT NOT NULL, -- can be updated
    info TEXT NOT NULL, -- can be updated
    created TIMESTAMPTZ DEFAULT  now() NOT NULL,
	updated TIMESTAMPTZ DEFAULT now() NOT NULL,
	CONSTRAINT unique_id_account_category_account_general_text UNIQUE (id_account, category)
);

CREATE TABLE account_general_blob (
    id_account_general_blob UUID DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    id_account UUID NOT NULL REFERENCES account(id_account) ON DELETE CASCADE ON UPDATE CASCADE,
    type TEXT CHECK (type IN ('image', 'video', 'audio', 'text')) NOT NULL, -- can be updated
	category TEXT NOT NULL, -- can be updated
    blob OID NOT NULL, -- can be updated
    created TIMESTAMPTZ DEFAULT  now() NOT NULL,
	updated TIMESTAMPTZ DEFAULT now() NOT NULL,	
	CONSTRAINT unique_id_account_category_account_general_blob UNIQUE (id_account, category)
);
DROP FUNCTION IF EXISTS create_account(text,text) ;
CREATE OR REPLACE FUNCTION create_account(_username text, hash_password text) RETURNS json AS $$
DECLARE
	_id_account UUID ;
	_id_account_sensible_text UUID ;
	msg text;
BEGIN
	INSERT INTO account (username) VALUES (_username)
		RETURNING id_account INTO _id_account;
	INSERT INTO account_sensible_text (id_account, category, info) VALUES (_id_account, 'hash_password', hash_password)
		RETURNING id_account_sensible_text INTO _id_account_sensible_text;
	RETURN json_build_object('succeed','true','id_account',_id_account);
	EXCEPTION
		WHEN others THEN
				GET STACKED DIAGNOSTICS msg = MESSAGE_TEXT;
			RETURN json_build_object('succeed','false', 'exception',msg);
END;
$$ LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS create_account_identity(text,text,text) ;
CREATE OR REPLACE FUNCTION create_account_identity(_username text, _lastname text, _firstname text) RETURNS json AS $$
DECLARE
	msg text;
BEGIN
	INSERT INTO account_identity (id_account, lastname, firstname) VALUES ((SELECT id_account FROM account WHERE username = _username),_lastname, _firstname);
	RETURN json_build_object('succeed','true');
	EXCEPTION
		WHEN others THEN
				GET STACKED DIAGNOSTICS msg = MESSAGE_TEXT;
			RETURN json_build_object('succeed','false', 'exception',msg);
END;
$$ LANGUAGE PLPGSQL;
--DELETE FROM account WHERE username = 'test_account';
--SELECT create_account('test_account', 'test_password');
--SELECT create_account_identity('test_account', 'nom', 'prenom');

DROP FUNCTION IF EXISTS store_bytea_in_lo(BYTEA);
CREATE OR REPLACE FUNCTION store_bytea_in_lo(file_data BYTEA)
RETURNS OID AS $$
DECLARE
    loid OID;
BEGIN

	SELECT lo_from_bytea(0, file_data) INTO loid;

    RETURN loid;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS create_session();
CREATE OR REPLACE FUNCTION create_session() RETURNS json AS $$
DECLARE
	_id_session UUID;
	msg text;
BEGIN
	INSERT INTO session_all DEFAULT VALUES RETURNING id_session INTO _id_session;
	RETURN json_build_object('succeed','true','id_session', _id_session);
	EXCEPTION
		WHEN others THEN
				GET STACKED DIAGNOSTICS msg = MESSAGE_TEXT;
			RETURN json_build_object('succeed','false', 'exception',msg);
END;
$$ LANGUAGE PLPGSQL;

--SELECT create_session();
DROP FUNCTION IF EXISTS connect_username_to_session(text);
CREATE OR REPLACE FUNCTION connect_username_to_session(_username text) RETURNS json AS $$
DECLARE
	msg text;
	_id_session UUID;
	_id_account UUID;
	nb_session integer;
BEGIN
	SELECT id_account INTO _id_account FROM account WHERE username = _username;

	SELECT COUNT(*),id_session INTO nb_session,_id_session FROM session_with_user WHERE id_account = _id_account;
	
	INSERT INTO session_all DEFAULT VALUES RETURNING id_session INTO _id_session;
	INSERT INTO session_with_user (id_session,id_account) 
		VALUES (
			_id_session,
			_id_account
			);
	RETURN json_build_object('succeed','true', 'username',_username,'id_session',_id_session);
	EXCEPTION
		WHEN others THEN
				GET STACKED DIAGNOSTICS msg = MESSAGE_TEXT;
			RETURN json_build_object('succeed','false', 'exception',msg);
END;
$$ LANGUAGE PLPGSQL;
--SELECT connect_username_to_session('home');

DROP FUNCTION IF EXISTS put_in_account_sensible_text(text,text,text);
CREATE OR REPLACE FUNCTION put_in_account_sensible_text(_username text, _cat text, _info text) RETURNS json AS $$
DECLARE
	_id_account UUID;
	msg text;
BEGIN
	SELECT id_account INTO _id_account FROM account WHERE username = _username;
	INSERT INTO account_sensible_text (id_account, category, info) VALUES (_id_account, _cat, _info);
	RETURN json_build_object('succeed','true','id_account',_id_account,'category',_cat);
	EXCEPTION
		WHEN others THEN
				GET STACKED DIAGNOSTICS msg = MESSAGE_TEXT;
			RETURN json_build_object('succeed','false', 'exception',msg);
END;
$$ LANGUAGE PLPGSQL;
--SELECT put_in_account_sensible_text('home','phone','45544d4');
DROP FUNCTION IF EXISTS put_in_account_sensible_blob(text,text,text);
CREATE OR REPLACE FUNCTION put_in_account_sensible_blob(_username text, _cat text,file_data BYTEA) RETURNS json AS $$
DECLARE
	_id_account UUID;
	msg text;
BEGIN
	SELECT id_account INTO _id_account FROM account WHERE username = _username;
	INSERT INTO account_sensible_blob (id_account, type, blob) VALUES (_id_account, _cat, store_bytea_in_lo(file_data));
	RETURN json_build_object('succeed','true','id_account',_id_account,'category',_cat);
	EXCEPTION
		WHEN others THEN
				GET STACKED DIAGNOSTICS msg = MESSAGE_TEXT;
			RETURN json_build_object('succeed','false', 'exception',msg);
END;
$$ LANGUAGE PLPGSQL;
SELECT put_in_account_sensible_blob('home','phone','45544d4');


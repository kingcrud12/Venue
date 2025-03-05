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
SELECT create_account_identity('test_account', 'nom', 'prenom');


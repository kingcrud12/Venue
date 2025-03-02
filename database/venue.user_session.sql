DROP TABLE IF EXISTS session_all, session_closed,session_with_user,session_event,session_device_info,session_ip_address ;

CREATE TABLE session_all (
	id_session UUID DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
	created TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE session_closed(
	id_session UUID NOT NULL  PRIMARY KEY REFERENCES session_all(id_session) ON UPDATE CASCADE  ON DELETE CASCADE,
	closed TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE session_with_user (
	id_session UUID NOT NULL  PRIMARY KEY REFERENCES session_all(id_session)  ON DELETE CASCADE  ON UPDATE CASCADE,
	id_account UUID NOT NULL  REFERENCES account(id_account) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE session_event(
	id_event_session UUID DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
	id_session UUID NOT NULL  REFERENCES session_all(id_session) ON DELETE CASCADE  ON UPDATE CASCADE,
	event_type TEXT CHECK (event_type IN ('login', 'logout', 'idle', 'reactivate', 'timeout')) NOT NULL,
	created TIMESTAMPTZ DEFAULT now() NOT NULL,
	details JSONB DEFAULT '{}' NOT NULL,
	CONSTRAINT unique_id_session_event_type UNIQUE (id_session, event_type)
);

CREATE TABLE session_device_info(
	id_session UUID NOT NULL REFERENCES session_all(id_session) ON DELETE CASCADE ON UPDATE CASCADE,
	info_type TEXT NOT NULL,
	info_data TEXT NOT NULL,
	CONSTRAINT primary_key_session_device_info PRIMARY KEY (id_session, info_type)
);

CREATE TABLE session_ip_address(
		id_session UUID NOT NULL  PRIMARY KEY REFERENCES session_all(id_session) ON DELETE CASCADE ON UPDATE CASCADE,
		ip_address INET NOT NULL
);
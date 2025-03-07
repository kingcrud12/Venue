DROP VIEW IF EXISTS session_open;
CREATE VIEW session_open AS
SELECT swu.id_account, sa.id_session, sa.created
FROM session_all sa
JOIN session_with_user swu ON sa.id_session = swu.id_session
LEFT JOIN session_closed sc ON sa.id_session = sc.id_session
WHERE sc.id_session IS NULL
	AND sa.created > NOW() - '3 minutes'::interval;
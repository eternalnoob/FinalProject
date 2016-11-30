# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable', Field('myfield', 'string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
#       'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.
import datetime




# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)
db.define_table('events',
                Field('latitude', 'double'),
                Field('longitude', 'double'),
                Field('creator', db.auth_user, required=True, default=auth.user_id),
                Field('created_on', 'datetime', default=datetime.datetime.utcnow()),
                Field('edited_on', 'datetime', update=datetime.datetime.utcnow()),
                Field('occurs_at', 'datetime', required=True),
                Field('title', 'string', default="", required=True),
                Field('description', 'string', default=""))

# this is the idea that a user can confirm that an event is correct
# lit party, real bad stuff, etc.
db.define_table('confirmations',
                Field('user_id', db.auth_user, required=True, default=auth.user_id),
                Field('event_id', db.events, required=True),
                Field('confirmation', 'boolean', required=True),
                Field('created_on', 'datetime', default=datetime.datetime.utcnow()),
                Field('edited_on', 'datetime', update=datetime.datetime.utcnow()))

from gluon.utils import web2py_uuid
if session.hmac_key is None:
    session.hmac_key = web2py_uuid()


# Here go your api methods.
import datetime
from datetime import timedelta

def get_user_full_name(user_id):
    user = db(db.auth_user.id == user_id).select().first()
    return user.first_name + ' ' + user.last_name

def translate_event(event):
    event_dict = dict()

    event_dict['lat'] = event.latitude
    event_dict['lng'] = event.longitude
    if auth.user and event.creator == auth.user.id:
        event_dict['modifiable'] = True
    else:
        event_dict['modifiable'] = False
    event_dict['creator'] = get_user_full_name(event.creator)
    event_dict['occurs_at'] = event.occurs_at
    event_dict['title'] = event.title
    event_dict['description'] = event.description
    event_dict['edited_on'] = event.edited_on
    event_dict['infobox_content'] = event.title + ': ' + event.description
    event_dict['id'] = event.id
    if auth.user:
        check = db(db.confirmations.event_id == event.id,
                   db.confirmations.user_id == auth.user.id).select().first()
        if check:
            event_dict['attending'] = check.confirmation
        else:
            event_dict['attending'] = False
    else:
        event_dict['attending'] = False
    confirmations = [x for x in db(db.confirmations.event_id == event.id,
                       db.confirmations.confirmation==True).select()]
    event_dict['total_attendees'] = len(confirmations)

    if len(confirmations) > 0:
        event_dict['marker_url'] = URL('static', 'images/fire.png')
    else:
        event_dict['marker_url'] = URL('static', 'images/poopoo.png')

    return event_dict

def getmarkers():
    events = db(db.events.occurs_at > (datetime.datetime.utcnow() - timedelta(minutes=45))
                                       ).select(orderby=~db.events.occurs_at)
    return_dict = {'events': []}
    for event in events:
        return_dict['events'].append(translate_event(event))
    return_dict['loggedin'] = True if auth.user is not None else False
    return response.json(return_dict)

@auth.requires_login()
def addevent():
    lat = request.vars.latitude
    lng = request.vars.longitude
    title = request.vars.title
    occur_date = request.vars.date
    description = request.vars.description
    occur_date = datetime.datetime.strptime(occur_date, "%Y-%m-%dT%H:%M:%S.%fZ")
    # parses ISO string, just call toISOString() on any javascript date object
    event_id = db.events.insert(latitude=lat, longitude=lng, title=title, occurs_at=occur_date,
                                description=description, creator=auth.user.id)
    event = db(db.events.id == event_id).select().first()
    response.status = 201
    return response.json(translate_event(event))

@auth.requires_login()
def confirm():
    event_id = request.vars.event_id
    user_id = auth.user.id
    is_real = bool(request.vars.isreal)
    event = db(db.confirmations.user_id==user_id,db.confirmations.event_id == event_id).select().first()
    if event:
        db(db.confirmations.user_id==user_id, db.confirmations.event_id==event_id).select().first().update_record(
            confirmation=is_real)
    else:
        db.confirmations.insert(user_id=user_id, event_id=event_id, confirmation=is_real)

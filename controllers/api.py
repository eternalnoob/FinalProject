# Here go your api methods.
import datetime

def get_user_full_name(user_id):
    user = db(db.auth_user.id == user_id).select().first()
    return user.first_name + ' ' + user.last_name

def translate_event(event):
    event_dict = dict()
    event_dict['position'] = {'lat': event.latitude,
                              'lng': event.longitude}
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
    return event_dict

def getmarkers():
    events = db(db.events.occurs_at > datetime.datetime.utcnow()).select(orderby=~db.events.occurs_at)
    return_dict = {'events': []}
    for event in events:
        return_dict['events'].append(translate_event(event))
    return response.json(return_dict)

@auth.requires_login()
def addevent():
    print(auth.user)
    lat = request.vars.latitude
    lng = request.vars.longitude
    title = request.vars.title
    occur_date = request.vars.date
    description = request.vars.description
    occur_date = datetime.datetime.strptime(occur_date, "%Y-%m-%dT%H:%M:%S.%fZ")
    # parses ISO string, just call toISOString() on any javascript date object
    event_id = db.events.insert(latitude=lat, longitude=lng, title=title, occurs_at=occur_date,
                                description=description)
    event = db(db.events.id == event_id).select().first()
    response.status = 201
    return response.json(translate_event(event))







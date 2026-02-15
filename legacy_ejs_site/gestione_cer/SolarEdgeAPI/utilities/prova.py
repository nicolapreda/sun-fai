def url_join(*parts):
    """
    Join terms together with forward slashes
    """

    # first strip extra forward slashes (except http:// and the likes) and
    # create list
    part_list = []
    for part in parts:
        p = str(part)
        if p.endswith('//'):
            p = p[0:-1]
        else:
            p = p.strip('/')
        part_list.append(p)

    # join everything together
    url = '/'.join(part_list)
    return url


def http_request(url, params=None, headers=None, timeout=10):
    if type(params) is dict:
        for key in params:
            print("PRE ", params[key])
            params[key] = str(params[key]).strip(' ')
            print(params[key])

BASEURL='https://monitoringapi.solaredge.com'
site_id="SITE_ID"
api_key="API_KEY"
start_time="START_TIME"
end_time="END_TIME"
url = url_join(BASEURL, "site", site_id, "powerDetails")

print(url)

meters="powerDetails"
params = {
    'api_key': api_key,
    'startTime': start_time,
    'endTime': end_time
}
if meters:
    params['meters'] = meters

http_request(url, params)


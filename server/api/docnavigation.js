let cache = {};

export default defineEventHandler(async (event) => {
    let method = getMethod(event);
    let type = getQuery(event).type;
    console.log("METHOD : " + method);
    if (method === "GET") {
        setResponseStatus(event, cache[type] ? 200 : 404)
    } else if (method === "DELETE"){
        delete cache[type]
        setResponseStatus(event, 204)
    } else {
        cache[type] = await readBody(event)
        setResponseStatus(event, 201)
    }
    return cache[type] ?? ""
})

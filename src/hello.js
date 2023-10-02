exports.handler = async () => {
    return buildResponseBody(200, JSON.stringify({
        hello: 'world'
    }));
};

const buildResponseBody = (status, body, headers = {}) => {
    return {
        statusCode: status,
        headers,
        body,
    };
};
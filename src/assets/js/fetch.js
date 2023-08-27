export function getAll()
{
    return fetch('http://127.0.0.1:8080/favourite/get',
    {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response=>response.json());
}

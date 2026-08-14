export async function createRecord(collection, payload) {
    try {
        let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/${collection}`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": localStorage.getItem("token")
            },
            body: JSON.stringify(payload)
        })
        return await response.json()
    } catch (error) {
        console.log(error)
    }
}
export async function createMultipartRecord(collection, payload) {
    try {
        let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/${collection}`, {
            method: "POST",
            headers: {
                "authorization": localStorage.getItem("token")
            },
            body: payload
        })
        return await response.json()
    } catch (error) {
        console.log(error)
    }
}
export async function getRecord(collection) {
    let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/${collection}`, {
        method: "GET",
        headers: {
            "content-type": "application/json",
        }
    })

    // Fetch does NOT throw on HTTP error codes (4xx/5xx) — only on network
    // failures. We attach the status so saga catch blocks can inspect it
    // (e.g. treat 404 as "no record yet" rather than a real error).
    if (!response.ok) {
        const err = new Error(`HTTP ${response.status}`)
        err.response = { status: response.status }
        throw err
    }

    return await response.json()
}

export async function updateRecord(collection, payload) {
    try {
        let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/${collection}/${payload._id}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
                "authorization": localStorage.getItem("token")
            },
            body: JSON.stringify(payload)
        })
        return await response.json()
    } catch (error) {
        console.log(error)
    }
}
export async function updateMultipartRecord(collection, payload) {
    try {
        let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/${collection}/${payload.get('_id')}`, {
            method: "PUT",
            headers: {
                "authorization": localStorage.getItem("token")
            },
            body: payload
        })
        return await response.json()
    } catch (error) {
        console.log(error)
    }
}

export async function deleteRecord(collection, payload) {
    try {
        let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/${collection}/${payload._id}`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                "authorization": localStorage.getItem("token")
            }
        })
        return await response.json()
    } catch (error) {
        console.log(error)
    }
}
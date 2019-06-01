class HttpClient {
    constructor() {
    }

    get(url) {
        return new Promise((accept, reject) => {
            $.ajax({
                url: url,
                type: "GET",
                success: (data) => {
                    accept(data)
                },
                error: (xhr, status, error) => {
                    reject(error);
                }
            })
        })
    }

    post(url, data) {
        return new Promise((accept, reject) => {
            $.ajax({
                url: url,
                data: JSON.stringify(data),
                type: "POST",
                contentType: "application/json",
                success: (data) => {
                    accept(data)
                },
                error: (xhr, status, error) => {
                    reject(error);
                }
            })
        })
    }
}
const Main = {
    baseUrl: document.baseURI,
    timeInterval: null,
    init: function () {
        if (this.timeInterval) {
            clearInterval(this.timeInterval)
        }
        this.events();
    },
    events: function () {
        this.getRandomNumber();
    },
    getRandomNumber: function () {
        this.request(`./main.php`)
            .then((response) => {
                let randomNumber = response.data;
                this.loadImage(randomNumber, (img, found) => {
                    if (found) {
                        this.increaseViewNumber(randomNumber).then(() => {
                            document.getElementById("banner").appendChild(img);
                            this.renderViewCount(randomNumber);
                            if (!this.timeInterval) {
                                this.timeInterval = setInterval(() => this.renderViewCount(randomNumber), 5000);
                            }
                        });
                    } else {
                        let img = new Image();
                        img.alt = 'banner';
                        img.src = `${this.baseUrl}/src/empty.jpg`;
                        document.getElementById("banner").appendChild(img);
                        alert("image does not exist")
                    }
                })
            });
    },
    increaseViewNumber: function (imageId) {
        return this.request(`./main.php`, 'POST', {
            action: 'INCREASE_VIEW_NUMBER',
            imageId
        }).then(() => {
            console.log(1213);
        }).catch((err) => {
            console.error(err);
        });
    },
    getCurrentViewCount: function (imageId) {
        return this.request(`./main.php`, 'POST', {
            action: 'GET_CURRENT_VIEW_COUNT',
            imageId
        });
    },
    loadImage: function (imageId, callback) {
        let img = new Image();
        img.src = `${this.baseUrl}/src/${imageId}.jpg`;
        img.alt = 'banner';

        if (img.complete) {
            callback(img, true)
        } else {
            img.onload = () => {
                callback(img, true)
            };

            img.onerror = () => {
                callback(img, false)
            };
        }
    },
    renderViewCount: function (imageId) {
        this.getCurrentViewCount(imageId).then((res) => {
            document.getElementById('value').innerText = res.data;
        })
    },
    request: async function (endpoint = '', method = 'GET', body = {}) {
        let config = {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        if (Object.keys(body).length) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(endpoint, config);

        if (response?.ok) {
            return response.json();
        } else {
            console.error(`HTTP Response Code: ${response?.status}`);
            return [];
        }
    }
};

document.addEventListener('DOMContentLoaded', function () {
    Main.init();
});
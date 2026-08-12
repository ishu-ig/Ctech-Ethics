require('mongoose')
    .connect(process.env.DB_KEY)
    .then(() => {
        console.log("Database connected successfully")
    })
    .catch((error) => {
        console.log(error)
    })

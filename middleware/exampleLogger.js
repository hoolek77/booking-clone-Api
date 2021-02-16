// names should just example (eg. auth - to authorization)
const exampleLogger = (req, res, next) => {
    console.log("Logging...")
    next();
}

module.exports = exampleLogger
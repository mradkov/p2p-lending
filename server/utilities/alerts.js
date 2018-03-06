module.exports = {
    show: (type, message) => {
        return {
            type: type,
            bs: {
                class: 
                    type == 'error' ? 'danger' 
                        : type == 'warning' ? 'warning' 
                        : type == 'success' ? 'success'
                        : type == 'info' ? 'info' : ''
            },
            message: {
                heading: 
                    type == 'error' ? 'Error!' 
                        : type == 'warning' ? 'Warnin!' 
                        : type == 'success' ? 'Success!'
                        : type == 'info' ? 'Info!' : '',
                text: message
            }
        }

    },
    handleMongooseError: (err) => {
        let firstKey = Object.keys(err.errors)[0]
        let message = err.errors[firstKey].message
        return {
            type: 'error',
            bs: {
                class: 'danger'
            },
            message: {
                heading: 'Error!',
                text: message
            }
        }
    }
}
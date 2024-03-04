const { Schema, model } = require('mongoose');


const thoughtSchema = new Schema({
    thoughtText: {
        
    },
    createdAt: {

    },
    username: {

    },
    reactions: []
},
{
toJSON: {
    getters: true
},
id: false
})

thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
})

const Thought = model("Thoughts", thoughtSchema);

module.exports = Thought;
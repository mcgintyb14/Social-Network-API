const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');
const dateFormat = require('../utils/dateHelper');


const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: 'You need to leave a thought to submit!',
        minLength: 1,
        maxLength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: timestamp => dateFormat(timestamp)
    },
    username: {
        type: String,
        required: true
    },
    reactions: [{ type: Schema.Types.ObjectId, ref: 'Reaction' }] // Use the reactionSchema for the reactions field
}, {
    toJSON: {
        getters: true
    },
    id: false
});

thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
})

// The below code ensures that any reactions associated with a thought are also deleted when that thought gets deleted
thoughtSchema.pre('remove', async function(next) {
    try {
        // Access the Reaction model to delete reactions
        await this.model('Reaction').deleteMany({ _id: { $in: this.reactions } });
        next();
    } catch (error) {
        next(error);
    }
});

const Thought = model("Thoughts", thoughtSchema);

module.exports = Thought;
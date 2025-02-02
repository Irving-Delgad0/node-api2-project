// implement your posts router here
const express = require('express')
const Post = require('./posts-model')

const router = express.Router();

router.get('/', (req, res) => {
    Post.find(req.query)
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({message: 'Error retrieving the adopters'})
    })
})

router.get('/:id', (req,res) => {
    Post.findById(req.params.id)
    .then(post => {
        if(post) {
            res.status(200).json(post)
        }else{
            res.status(404).json({message: 'The post with the specified ID does not exist'})
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({message: 'Error retrieving the adopter'})
    })
})

router.post('/', (req, res) => {
    const {title, contents} = req.body
    if(!title || !contents) {
        res.status(400).json({message: "Please provide title and contents for the post"})
    } else {
    Post.insert(req.body)
    .then(post => {
        Post.findById(post.id)
        .then(post => {
            res.status(201).json(post)
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({message: "There was an error while saving the post to the database"})
    })
}
})

router.put('/:id', (req, res) => {
    const {title, contents} = req.body
    if(!title || !contents){
        res.status(400).json({message: "Please provide title and contents for the post"})
    } else {
    Post.update(req.params.id, req.body)
    .then(posts => {
        if(posts){
            Post.findById(req.params.id)
            .then(post => {
                res.status(200).json(post)
            })
        } else {
            res.status(404).json({message: 'The post with the specified ID does not exist'})
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({message: "The post information could not be modified"})
    })
}
})

router.delete('/:id', (req,res) => {

    Post.findById(req.params.id)
    .then(post => {
        if(post){
        const postToDelete = post
        Post.remove(req.params.id)
        .then(result => {
            if(result) {
                res.json(postToDelete)
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({message: "The post could not be removed"})
});
        }else {
            res.status(404).json({message: "The post with the specified ID does not exist"})
        }
    });
})

router.get('/:id/comments', (req, res) => {
    Post.findPostComments(req.params.id)
    .then(comments => {
        if(comments.length > 0){
        res.status(200).json(comments)
        }else{
            res.status(404).json({message: "The post with the specified ID does not exist"})
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({message: "The comments information could not be retrieved"})
    })
})


module.exports = router;
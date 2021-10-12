const express = require('express');
const router = express.Router();

const pooldb = require('../database');
const {isLoggedIn} = require('../lib/auth');

router.get('/add',isLoggedIn, (req, res)=>{
    res.render('links/add');
});
// añadir enlaces
router.post('/add',isLoggedIn, async (req, res)=>{
    const { title, url, description } = req.body;
    const newLink= {
        title,
        url,
        description,
        user_id: req.user.id
    }
    await pooldb.query('insert into links set ?', [newLink]);
    req.flash('success', 'Link guardado correctamente');
    res.redirect('/links');//despues de recibir eenvia a links
});
// mostrar links guardados
router.get('/',isLoggedIn, async (req, res) => {
    const links = await pooldb.query('select * from links where user_id = ?',[req.user.id] );
    console.log(links);
    res.render('links/list', { links });
});
//eliminar link
router.get('/delete/:id',isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    await pooldb.query('delete from links where id = ?', [id]);
    req.flash('success', 'Link eliminado correctamente');
    res.redirect('/links');
});
//editar link
router.get('/edit/:id',isLoggedIn, async (req, res)=>{
   const {id} = req.params;
    const links = await pooldb.query('select * from links where id =?',[id]);
    res.render('links/edit', {link: links[0]}) 
});
router.post('/edit/:id',isLoggedIn, async (req, res)=>{
    const {id}= req.params;
    const {title,url,description} = req.body;
    const newLink = {
      title, description, url  
    };
    await pooldb.query('update links set ? where id=?', [newLink, id]);
    req.flash('success', 'Link editado correctamente');
    res.redirect('/links');
});
module.exports = router;
const router = require("express").Router();
const {UsuarioController} = require("../controllers");
const { authMiddleware } = require("../middlewares");
const { create, login, updatemail, updatesenha } = new UsuarioController();

// curl -X POST -d "mail=teste@teste.com&senha=123456" http://localhost:3100/api/usuario/create
router.post("/create", create);

// curl -X GET -d "mail=teste@teste.com&senha=123456" http://localhost:3100/api/usuario/login
router.get("/login", login);

router.use(authMiddleware);

// curl -X PUT -d "mail=tester@teste.com" http://localhost:3100/api/usuario/update/mail
router.put("/update/mail", updatemail);

// curl -X PUT -d "senha=123457" http://localhost:3100/api/usuario/update/senha
router.put("/update/senha", updatesenha);

router.use( (req, res) => {
    res.status(400).json({error:['Operação desconhecida com o usuário']});
})

module.exports = router;
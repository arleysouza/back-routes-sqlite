# Aplicação back-end 
O objetivo desta aplicação é criar um servidor web usando Express, fazer uso de rotas, controle de acesso, mapeamento ORM usando o Sequelize e persistir dados no SQLite.

##Requisitos
1. O usuário efetua o seu próprio cadastro;
2. O usuário efetua login;
3. O usuário altera mail e senha;
4. O e-mail é único;
5. O usuário registra gasto;
6. O usuário altera gasto;
7. O usuário remove gasto;
8. O usuário lista todos os seus gastos;
9. O usuário faz uma busca usando a descrição;
10. O usuário possui acesso a somente os seus próprios gastos;
11. As operações com os gastos requerem login;
12. Os dados precisam ser persistidos no SQLite.

## Modelo de dados
Os dados são persistidos nas seguintes tabelas.
![](https://github.com/arleysouza/back-routes-sqlite/blob/main/images/modelo.png)

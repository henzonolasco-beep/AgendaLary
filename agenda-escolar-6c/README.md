# Agenda Escolar 6º C

## Criar uma conta de administrador

1. No Replit, abra **Secrets** e defina `ADMIN_SIGNUP_CODE` com um código aleatório e longo (mínimo de 16 caracteres). Nunca coloque esse código no código-fonte ou o envie pelo chat.
2. Para o site publicado, defina também `ADMIN_SIGNUP_CODE` em **Publishing → Production app secrets**. Você pode usar um código diferente em desenvolvimento e produção.
3. Na tela **Criar conta**, preencha nome, nome de usuário, e-mail e a senha pessoal da conta. Digite o código no campo **Código de administrador**. Sem o código, a conta será de estudante.
4. O código não é a senha usada para entrar. Cada administrador tem seu próprio nome de usuário e senha; o servidor concede a função e salva somente o hash da senha pessoal.
5. Só compartilhe o código com quem deve poder criar contas administrativas. Troque o segredo para impedir novos cadastros com o código antigo; administradores já cadastrados mantêm a função.

Os nomes são obrigatórios e aparecem no perfil da conta para identificar cada administrador. O nome de usuário é o identificador usado para entrar; o e-mail fica salvo para contato. O servidor aplica permissões nas operações de publicação, edição e exclusão, mesmo que alguém tente chamar a API diretamente.

Esta autenticação substitui o Clerk gerenciado pelo Replit. Contas antigas do Clerk não são transferidas e precisam ser cadastradas novamente. Publicações existentes no PostgreSQL são preservadas.

## Publicar

1. Defina `ADMIN_SIGNUP_CODE` em **Secrets** e também em **Publishing → Production app secrets**.
2. Publique pelo botão **Publish** do Replit.
3. Crie a conta administrativa no site publicado usando o código configurado para produção.
4. Cadastre uma atividade e um aviso e atualize a página para confirmar que os dados foram salvos.

O PostgreSQL do Replit mantém as publicações. A estrutura do banco de desenvolvimento é aplicada ao banco de produção durante o fluxo de publicação do Replit.

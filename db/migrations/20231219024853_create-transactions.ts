import { Knex } from "knex";

/*O metado up, vai ser responsaveis pelo oq vamos realizar nessa migration
o que ela vai fazer no nosso banco de dados: Ela vai criar uma tabela, vai add 
um campo numa tabela existente, vai remover uma tabela. Exemplos que pode ser feito
dentro do metodo up
*/
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary()
    table.text('title').notNullable()
    table.decimal('amount', 10, 2).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  }) 
}

/* O metado down , seria um metedo que resolveria algum problema e caso precisaria
voltar atrás, fazer um roll back, resumindo o down ira fazer o contrario do metodo
up faz.   
*/
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transactions')
}



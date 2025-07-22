const mysql = require('mysql2/promise');

async function testDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'bolsa_estudos'
    });

    console.log('Conectado ao banco de dados!');

    // Inserir uma candidatura de teste
    const insertQuery = `
      INSERT INTO applications (
        nome_completo, email, telefone, bilhete_identidade, data_nascimento,
        endereco, situacao_academica, nome_escola, media_final, universidade,
        curso, categoria, carta_motivacao, nome_encarregado, telefone_encarregado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const testData = [
      'João Silva Santos',
      'joao.silva@email.com',
      '+244 900 123 456',
      '123456789LA001',
      '2000-05-15',
      'Rua da Paz, 123, Luanda',
      'terminado',
      'Escola Nacional de Luanda',
      18.5,
      'Universidade Agostinho Neto',
      'Engenharia Informática',
      'universitario',
      'Desejo muito esta bolsa para continuar meus estudos e contribuir para o desenvolvimento de Angola.',
      'Maria Silva Santos',
      '+244 900 654 321'
    ];

    const result = await connection.execute(insertQuery, testData);
    console.log('Candidatura inserida com sucesso! ID:', result[0].insertId);

    // Verificar se foi inserida
    const [rows] = await connection.execute('SELECT * FROM applications WHERE id = ?', [result[0].insertId]);
    console.log('Dados inseridos:', rows[0]);

    // Verificar estatísticas
    const [stats] = await connection.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pendente' THEN 1 ELSE 0 END) as pendentes,
        SUM(CASE WHEN status = 'aprovado' THEN 1 ELSE 0 END) as aprovados
      FROM applications
    `);
    console.log('Estatísticas:', stats[0]);

    await connection.end();
    console.log('Teste concluído com sucesso!');

  } catch (error) {
    console.error('Erro no teste:', error);
  }
}

testDatabase();


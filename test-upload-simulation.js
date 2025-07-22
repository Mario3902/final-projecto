const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function simulateDocumentUpload() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'bolsa_estudos'
    });

    console.log('Conectado ao banco de dados!');

    // Simular inserção de documentos para a candidatura ID 1
    const applicationId = 1;
    
    const documents = [
      {
        type: 'bilhete_identidade',
        fileName: 'bilhete_identidade_joao.pdf',
        filePath: '/uploads/bilhete_identidade_joao.pdf',
        fileSize: 1024000,
        mimeType: 'application/pdf'
      },
      {
        type: 'certificado_ensino',
        fileName: 'certificado_ensino_joao.pdf',
        filePath: '/uploads/certificado_ensino_joao.pdf',
        fileSize: 2048000,
        mimeType: 'application/pdf'
      },
      {
        type: 'declaracao_notas',
        fileName: 'declaracao_notas_joao.pdf',
        filePath: '/uploads/declaracao_notas_joao.pdf',
        fileSize: 1536000,
        mimeType: 'application/pdf'
      },
      {
        type: 'declaracao_matricula',
        fileName: 'declaracao_matricula_joao.pdf',
        filePath: '/uploads/declaracao_matricula_joao.pdf',
        fileSize: 1792000,
        mimeType: 'application/pdf'
      },
      {
        type: 'carta_recomendacao',
        fileName: 'carta_recomendacao_joao.pdf',
        filePath: '/uploads/carta_recomendacao_joao.pdf',
        fileSize: 512000,
        mimeType: 'application/pdf'
      }
    ];

    // Inserir documentos na tabela documents
    for (const doc of documents) {
      const insertQuery = `
        INSERT INTO documents (
          application_id, document_type, file_name, file_path, file_size, mime_type
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;

      const result = await connection.execute(insertQuery, [
        applicationId,
        doc.type,
        doc.fileName,
        doc.filePath,
        doc.fileSize,
        doc.mimeType
      ]);

      console.log(`Documento ${doc.type} inserido com ID:`, result[0].insertId);
    }

    // Verificar documentos inseridos
    const [docs] = await connection.execute(
      'SELECT * FROM documents WHERE application_id = ?',
      [applicationId]
    );

    console.log('\nDocumentos inseridos para a candidatura:');
    docs.forEach(doc => {
      console.log(`- ${doc.document_type}: ${doc.file_name} (${doc.file_size} bytes)`);
    });

    // Verificar candidatura com documentos
    const [application] = await connection.execute(
      'SELECT * FROM applications WHERE id = ?',
      [applicationId]
    );

    console.log('\nCandidatura encontrada:');
    console.log(`Nome: ${application[0].nome_completo}`);
    console.log(`Email: ${application[0].email}`);
    console.log(`Status: ${application[0].status}`);
    console.log(`Total de documentos: ${docs.length}`);

    await connection.end();
    console.log('\nSimulação de upload concluída com sucesso!');

  } catch (error) {
    console.error('Erro na simulação:', error);
  }
}

simulateDocumentUpload();


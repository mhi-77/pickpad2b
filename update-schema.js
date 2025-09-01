// Script para obtener el esquema actualizado de Supabase
import { supabase } from './src/lib/supabase.js';

async function updateDatabaseSchema() {
  console.log('🔄 Obteniendo esquema actualizado de Supabase...');
  
  try {
    // Obtener información de todas las tablas
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');

    if (tablesError) {
      console.error('❌ Error obteniendo tablas:', tablesError);
      return;
    }

    console.log('📋 Tablas encontradas:', tables.map(t => t.table_name));

    // Para cada tabla, obtener sus columnas
    for (const table of tables) {
      console.log(`\n🔍 Analizando tabla: ${table.table_name}`);
      
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_schema', 'public')
        .eq('table_name', table.table_name)
        .order('ordinal_position');

      if (columnsError) {
        console.error(`❌ Error obteniendo columnas de ${table.table_name}:`, columnsError);
        continue;
      }

      console.log(`📊 Columnas de ${table.table_name}:`);
      columns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : '(NULLABLE)'}`);
      });

      // Obtener políticas RLS si existen
      const { data: policies, error: policiesError } = await supabase
        .from('pg_policies')
        .select('policyname, cmd, qual, with_check')
        .eq('schemaname', 'public')
        .eq('tablename', table.table_name);

      if (!policiesError && policies.length > 0) {
        console.log(`🔒 Políticas RLS de ${table.table_name}:`);
        policies.forEach(policy => {
          console.log(`  - ${policy.policyname} (${policy.cmd})`);
        });
      }
    }

    // Obtener relaciones de claves foráneas
    console.log('\n🔗 Obteniendo relaciones de claves foráneas...');
    const { data: foreignKeys, error: fkError } = await supabase
      .from('information_schema.key_column_usage')
      .select(`
        table_name,
        column_name,
        referenced_table_name,
        referenced_column_name
      `)
      .eq('table_schema', 'public')
      .not('referenced_table_name', 'is', null);

    if (!fkError && foreignKeys.length > 0) {
      console.log('🔗 Claves foráneas encontradas:');
      foreignKeys.forEach(fk => {
        console.log(`  ${fk.table_name}.${fk.column_name} -> ${fk.referenced_table_name}.${fk.referenced_column_name}`);
      });
    }

    console.log('\n✅ Esquema actualizado correctamente');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la función
updateDatabaseSchema();
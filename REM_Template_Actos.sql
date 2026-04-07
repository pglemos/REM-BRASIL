-- ========================================================================================
-- REM OS - Template 30 ACTOS (Sprint 1)
-- Ticket: REM-S1-004 (Replicação template 30 ACTOS)
-- ========================================================================================

-- Função para popular os 30 ACTOS de uma edição recém-criada
create or replace function populate_edition_actos()
returns trigger as $$
declare
  i int;
  day_num int;
  acto_code text;
  acto_title text;
  acto_category text;
begin
  -- Loop para criar 30 ACTOS
  for i in 1..30 loop
    -- Define o dia (1 a 15 no Dia 1, 16 a 30 no Dia 2)
    if i <= 15 then
      day_num := 1;
    else
      day_num := 2;
    end if;

    -- Gera código e título
    acto_code := 'ACTO-' || lpad(i::text, 2, '0');
    acto_title := 'ACTO ' || i || ' - Template Padrão';
    
    -- Categorias básicas
    if i = 1 or i = 16 then
      acto_category := 'Abertura';
    elsif i = 15 or i = 30 then
      acto_category := 'Fechamento';
    else
      acto_category := 'Conteúdo';
    end if;

    -- Insere o ACTO
    insert into actos (
      edition_id,
      code,
      title,
      day_number,
      sequence_order,
      current_status,
      category
    ) values (
      new.id,
      acto_code,
      acto_title,
      day_num,
      i,
      'nao_iniciado',
      acto_category
    );
  end loop;

  return new;
end;
$$ language plpgsql;

-- Trigger que dispara após a inserção de uma nova edição
drop trigger if exists trigger_populate_edition_actos on editions;
create trigger trigger_populate_edition_actos
after insert on editions
for each row
execute function populate_edition_actos();

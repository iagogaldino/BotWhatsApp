import * as schedule from 'node-schedule';

let tasks = [];
// Função que será executada no horário agendado
function minhaFuncaoAgendada() {
    console.log('A função foi executada!');
    // Adicione aqui o código da sua função
}

export function startSchedule() {
    console.log('startSchedule#')
    /**
    16: No minuto 16.
    14: Às 14 horas.
    *: Qualquer dia do mês.
    *: Qualquer mês.
    *: Qualquer dia da semana.
     */
    // schedule.scheduleJob('16 14 * * *', minhaFuncaoAgendada)
    const scheduledTask = schedule.scheduleJob('16 14 * * *', minhaFuncaoAgendada);
    tasks.push(scheduledTask)

}

export function User(values: any) {
    return {
        id: values.id || '',
        name: values.image || '',
        phone: values.time || '',
        pass: values.pass || '',
        schedules: values.schedules || new Array(),
    }
}
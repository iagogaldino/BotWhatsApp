export function calendarM(values: any) {
    return {
        title: values.title || '',
        image: values.image || '',
        time: values.time || '',
        text: values.text || '',
        date: values.date || '',
        userId: values.userId || '',
        contacts: values.contacts || [],
    }
}
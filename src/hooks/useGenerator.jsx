function* indexGenerator() {
    let index = 0
    while (true) yield index++ 
}

const id = indexGenerator()

export default function useGenerator() {
    const newValue = id.next().value
    console.log(newValue)

    return newValue
}
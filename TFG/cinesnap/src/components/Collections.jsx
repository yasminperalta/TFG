import DVDCard from "./DVDCard";

function Collections () {
    return(
        <section className="collection">
            <h2>Mi colección (MOSTRAR SOLO CUANDO SE HAYA INICIADO SESIÓN (sino,
                se puede mostrar "los más buscados/populares" o algo de ese estilo))</h2>
            <div className="grid">
                <DVDCard />
                <DVDCard />
                <DVDCard />
            </div> 
        </section>
    )
}

export default Collections;
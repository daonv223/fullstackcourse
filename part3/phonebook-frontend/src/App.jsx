import { useEffect, useState } from 'react'
import personService from './services/persons'

const Notification = ({ message, className }) => {
  if (message === null) return null
  return (
    <div className={className}>
      {message}
    </div>
  )
}

const Filter = ({filter, onChange}) => 
  <div>
    filter shown with: <input value={filter} onChange={onChange} />
  </div>

const PersonForm = ({onSubmit, newName, onNameChange, newNumber, onNumberChange}) =>
  <form onSubmit={onSubmit}>
    <div>
      name: <input value={newName} onChange={onNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={onNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>

const Person = ({name, number, onDeleteClick}) => <p>{name} {number} <button type="button" onClick={onDeleteClick}>delete</button></p>

const Persons = ({personsToShow, handleDeletePerson}) => {
  return (
    <>
      {personsToShow.map(person => <Person key={person.id} name={person.name} number={person.number} onDeleteClick={() => handleDeletePerson(person)}/>)}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null) 

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = event => setNewName(event.target.value)
  const handleNumberChange = event => setNewNumber(event.target.value)
  const handleFilterChange = event => setFilter(event.target.value)
  const handleSubmitForm = event => {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name === newName)
    if (existingPerson !== undefined) {
      if (window.confirm(`${existingPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        const changedPerson = { ...existingPerson, number: newNumber }
        personService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            setMessage(`Updated ${returnedPerson.name}`)
            setMessageType('success')
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch(error => {
            setPersons(persons.filter(p => p.id !== existingPerson.id))
            setNewName('')
            setNewNumber('')
            setMessage(`Information of ${existingPerson.name} has already been removed from server`)
            setMessageType('error')
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      }
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setMessage(`Added ${returnedPerson.name}`)
          setMessageType('success')
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setMessage(error.response.data.error)
          setMessageType('error')
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }
  const handleDeletePerson = (deletedPerson) => {
    if (window.confirm(`Delete ${deletedPerson.name} ?`)) {
      personService
        .deletePerson(deletedPerson.id)
        .then(response => {
          if (response.status === 204) {
            setPersons(persons.filter(person => person.id !== deletedPerson.id));
          }
        })   
    }
 
  }

  const personsToShow = filter === '' ? persons : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} className={messageType} />
      <Filter filter={filter} onChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm onSubmit={handleSubmitForm} newName={newName} onNameChange={handleNameChange} newNumber={newNumber} onNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} handleDeletePerson={handleDeletePerson} />
    </div>
  )
}

export default App
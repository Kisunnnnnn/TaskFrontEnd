import axios from "axios"
import { useEffect, useState } from "react"
import { DebounceInput } from "react-debounce-input"

const initialBookData = {
    title: "",
    isbn: "",
    authors: "",
    description: ""
}
const initialMagazineData = {
    isbn: "",
    authors: "",
    publishedAt: ""
}
const AddData = () => {
    const [type, setType] = useState("")
    const [dataFile, setDataFile] = useState("")
    const [books, setBooks] = useState([])
    const [magazines, setMagazines] = useState([])
    const [queryBooks, setQueryBooks] = useState("")
    const [queryMagazines, setQueryMagazines] = useState("")
    const [isSearchBooks, setIsSearchBooks] = useState(false)
    const [isSearchMagazines, setIsSearchMagazines] = useState(false)
    const [filteredDataBooks, setFilteredDataBooks] = useState([])
    const [filteredDataMagazines, setFilteredDataMagazines] = useState([])
    const [addType, setAddType] = useState("csv")
    const [bookData, setBookData] = useState(initialBookData)
    const [magazineData, setMagazineData] = useState(initialMagazineData)
    const [bookOrMagazine, setBookOrMagazine] = useState("")


    useEffect(() => {
        getData()
    }, [])

    const onTypeChange = (e) => {
        setType(e.target.value)
    }
    const onFileChange = (e) => {
        setDataFile(e.target.files[0])
    }
    const handleAddClick = async (e) => {
        const formData = new FormData()
        formData.append("addBooks", dataFile)
        formData.append("type", type)
        const resp = await axios.post('/addData', formData)
        setType("")
        alert("File Added")
    }
    const getData = async () => {
        const bookData = await axios.post('/getData', { type: "book", sort: false })
        const magazineData = await axios.post('/getData', { type: "magazines", sort: false })
        setBooks(bookData.data.message)
        setMagazines(magazineData.data.message)

    }
    const handleSearchInputBooks = async (e) => {

        setQueryBooks(e.target.value)
        setIsSearchMagazines(false)
        setIsSearchBooks(true)
        const getResult = await axios.get(`/searchData?searchQuery=${e.target.value}&type=books`)
        console.log(getResult)
        setFilteredDataBooks(getResult.data.message)
    }
    const handleSearchInputMagazines = async (e) => {

        setQueryMagazines(e.target.value)
        setIsSearchBooks(false)
        setIsSearchMagazines(true)
        const getResult = await axios.get(`/searchData?searchQuery=${e.target.value}&type=magazines`)
        console.log(getResult)
        setFilteredDataMagazines(getResult.data.message)
    }
    const handleSortClick = async () => {
        setBooks([])
        setMagazines([])
        const bookData = await axios.post('/getData', { type: "book", sort: true })
        const magazineData = await axios.post('/getData', { type: "magazines", sort: true })
        setBooks(bookData.data.message)
        setMagazines(magazineData.data.message)
    }
    const handleAddType = (e) => {
        setAddType(e.target.value)
    }
    const handleBookDataChange = (e) => {
        setBookData(prevState => {
            return {
                ...prevState,
                [e.target.name]: e.target.value
            }
        })
    }
    const handleMagazineDataChange = (e) => {
        setMagazineData(prevState => {
            return {
                ...prevState,
                [e.target.name]: e.target.value
            }
        })
    }
    const handleAddDataClick = async () => {
        const saveDataResponse = await axios.post('/saveBooks', bookData)
        alert("Data Saved")
        setBookData(initialBookData)

    }
    const handleMagazineDataClick = async () => {
        const saveDataResponse = await axios.post('/saveMagazine', magazineData)
        alert("Data Saved")
        setMagazineData(initialMagazineData)
    }
    const handleBookOrMagazine = (e) => {
        setBookOrMagazine(e.target.value)
    }
    return (
        <div className="container mt-5">
            <center><h3>Add Data</h3></center>
            <div className="mt-3">
                <div className="row">
                    <select className="form-control" name="addType" value={addType} onChange={handleAddType}>
                        <option defaultValue>--Select how do you want to add data?--</option>
                        <option value="csv">Upload CSV</option>
                        <option value="manual">Enter fields</option>
                    </select>
                </div>
            </div>
            <div style={addType === "manual" ? { display: "inherit" } : { display: "none" }} className="mt-3">
                <div className="row">
                    <select className="form-control" name="bookOrMagazine" value={bookOrMagazine} onChange={handleBookOrMagazine}>
                        <option>--Select what do you want to add, book or magazine?</option>
                        <option value="Book">Book</option>
                        <option value="Magazine">Magazine</option>
                    </select>
                </div>
            </div>

            <div style={bookOrMagazine === "Book" ? { display: "inherit" } : { display: "none" }} className="mt-5">
                <div className="row">
                    <div className="col-md-6">
                        <input type="text" name="title" value={bookData.title} className="form-control" placeholder="Enter Title" onChange={handleBookDataChange} />
                    </div>
                    <div className="col-md-6">
                        <input type="text" name="isbn" value={bookData.isbn} className="form-control" placeholder="Enter ISBN" onChange={handleBookDataChange} />
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-md-6">
                        <input type="text" name="authors" value={bookData.authors} className="form-control" placeholder="Enter Authors" onChange={handleBookDataChange} />
                    </div>
                    <div className="col-md-4">
                        <input type="text" name="description" value={bookData.description} className="form-control" placeholder="Enter Description" onChange={handleBookDataChange} />
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-info" onClick={handleAddDataClick}>Add Data</button>
                    </div>
                </div>
            </div>
            <div style={bookOrMagazine === "Magazine" ? { display: "inherit" } : { display: "none" }} className="mt-5">
                <div className="row mt-5">
                    <div className="col-md-6">
                        <input type="text" name="isbn" value={magazineData.isbn} className="form-control" placeholder="Enter ISBN" onChange={handleMagazineDataChange} />
                    </div>
                    <div className="col-md-6">
                        <input type="text" name="authors" value={magazineData.authors} className="form-control" placeholder="Enter Authors" onChange={handleMagazineDataChange} />
                    </div>
                </div>
                <div className="row mt-4">

                    <div className="col-md-4">
                        <input type="text" name="publishedAt" value={magazineData.publishedAt} className="form-control" placeholder="Enter publish date" onChange={handleMagazineDataChange} />
                    </div>
                    <div className="col-md-4">
                        <button className="btn btn-info" onClick={handleMagazineDataClick}>Add Data</button>
                    </div>
                </div>
            </div>
            <div style={addType === "csv" ? { display: "block" } : { display: "none" }}>
                <div className="row mt-5">
                    <div className="col-md-4">
                        <select className="form-control" name="type" value={type} onChange={onTypeChange} defaultValue="--What do you want to add?">
                            <option>--What do you want to add?--</option>
                            <option value="book">Books</option>
                            <option value="magazine">Magazines</option>
                            <option value="author">Authors</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <input type="file" className="form-control" onChange={onFileChange} />
                    </div>
                    <div className="col-md-4">
                        <button className="btn  btn-info" onClick={handleAddClick}>Add</button>
                    </div>
                </div>

            </div>

            <hr />
            <button className="btn btn-info" onClick={handleSortClick}>Sort Data</button>
            <center><h3 className="mt-5"><u>Books</u></h3></center>
            <DebounceInput debounceTimeout={500} name="queryBooks" value={queryBooks} placeholder="Search..." onChange={handleSearchInputBooks} />
            <div>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Title</th>
                            <th scope="col">ISBN</th>
                            <th scope="col">Authors</th>
                            <th scope="col">Description</th>
                        </tr>
                    </thead>

                    <tbody>
                        {(isSearchBooks === false && isSearchMagazines === true) || (isSearchBooks === false && isSearchMagazines === false) ? books.map((data, index) => (
                            <tr key={index}>
                                <td key={index}>{data.title}</td>
                                <td>{data.isbn}</td>
                                <td>{data.authors}</td>
                                <td>{data.description}</td>
                            </tr>
                        )) : filteredDataBooks && filteredDataBooks.map((data, index) => (
                            <tr key={index}>
                                <td key={index}>{data.title}</td>
                                <td>{data.isbn}</td>
                                <td>{data.authors}</td>
                                <td>{data.description}</td>
                            </tr>))}

                    </tbody>

                </table>
            </div>
            <hr />
            <center><h3 className="mt-5"><u>Magazines</u></h3></center>
            <DebounceInput debounceTimeout={500} name="queryMagazines" value={queryMagazines} placeholder="Search..." onChange={handleSearchInputMagazines} />
            <div>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">ISBN</th>
                            <th scope="col">Authors</th>
                            <th scope="col">Published At</th>
                        </tr>
                    </thead>

                    <tbody>
                        {(isSearchMagazines === false && isSearchBooks === true) || (isSearchMagazines === false && isSearchBooks === false) ? magazines.map((data, index) => (
                            <tr key={index}>
                                <td>{data.isbn}</td>
                                <td>{data.authors}</td>
                                <td>{data.publishedAt}</td>
                            </tr>

                        )) : filteredDataMagazines && filteredDataMagazines.map((data, index) => (
                            <tr key={index}>
                                <td>{data.isbn}</td>
                                <td>{data.authors}</td>
                                <td>{data.publishedAt}</td>
                            </tr>

                        ))}

                    </tbody>

                </table>
            </div>
        </div>
    )
}
export default AddData
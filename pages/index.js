import React from 'react'

function postFile (url, fileSelector) {
  const fileField = document.querySelector(fileSelector)

  const form = new FormData()
  form.append('sampleFile', fileField.files[0])
  return fetch(url, {
    method: 'POST',
    body: form
  }).then(response => response.json())
}

export default () => {
  const [rows, setRows] = React.useState([])
  const [delimiter, setDelimiter] = React.useState(',')
  const [lines, setLines] = React.useState('2')

  const onSubmit = (e) => {
    e.preventDefault()
    postFile('/api/v1/uploads', 'input[type="file"].sampleFile')
      .then(({ data }) => setRows(data.split(/\n/).filter(d => d)))
      .catch(error => console.error(error))
  }

  return (
    <div className='holder'>
      <form onSubmit={onSubmit}>
        <input type='file' name='sampleFile' className='sampleFile' />
        <button type='submit'>Submit</button>
      </form>
      <div className='filter'>
        <input
          type='text' placeholder='filter' value={delimiter} onChange={e => {
            setDelimiter(e.target.value)
          }}
        />
        <input
          type='text' placeholder='lines' value={lines} onChange={e => {
            setLines(e.target.value)
          }}
        />
      </div>
      <div className='table'>
        <table>
          <tbody>
            {
              rows.slice(0, lines).map((row, idx) => (
                <tr key={idx}>
                  {
                    row.split(delimiter).map((column, idx) => (
                      <td key={idx}>{column}</td>
                    ))
                  }
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      <style jsx>
        {`
          form,
          input,
          table {
            margin-bottom: 10px;
          }
          .holder {
            margin: 25px;
          }

          td {
            border: 1px solid #333;
            padding: 10px;
          }
          
          td:first-child {
            border-right: 0px;
          }

          thead,
          tfoot {
            background-color: #333;
            color: #fff;
          }
        `}
      </style>
    </div>
  )
}

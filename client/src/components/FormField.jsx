import React from 'react'

const FormField = ({ label, name, value, onChange, type = 'text' }) => {
  return (
    <label className='flex flex-col w-[50%] m-auto '>
    <h1 className='text-2xl text-[#084DA6]'>{label}</h1>
    <textarea
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className='bg-[#F2A172] p-3 border-[#BF0A19] border-2 focus:border-[#BF0A19] rounded-md  text-[#0A6ABF] min-h-[25vh] text-lg'
    />
  </label>
  )
}

export default FormField

import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'


const Modal = ({ setIsOpen, auth }) => {
  const [role, setRole] = useState("Student")
  const navigate = useNavigate()

  const submitRole = (e) => {
    e.preventDefault()
    setIsOpen(false)
    console.log(role)
    if (auth === "Login") { 
      navigate("/login", { state: { role: role } })
      
    } else {
      navigate("/register", { state: { role: role } })
    }    
  }

  return (
    <div>
          
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-opacity-80">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Select Your Role</h2>

            <form className='w-full' onSubmit={submitRole}>
              <Menu as="div" className="relative inline-block text-left w-full">
                <div>
                  <MenuButton className="inline-flex w-full text-left justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
                    {role}
                    <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
                  </MenuButton>
                </div>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <div className="py-1">
                <MenuItem>
                  <div
                    onClick={()=>setRole("Professor")}
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Professor
                  </div>
                </MenuItem>
                <MenuItem>
                  <div
                    onClick={()=>setRole("Student")}
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Student
                  </div>
                </MenuItem>
                <MenuItem>
                  <div
                    onClick={()=>setRole("Assistant")}
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Assistant
                  </div>
                </MenuItem>
          
                </div>
              </MenuItems>
              </Menu>

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-400 text-white rounded mr-2"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button type='submit' className="px-4 py-2 bg-blue-600 text-white rounded">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
    </div>
  )
}

export default Modal

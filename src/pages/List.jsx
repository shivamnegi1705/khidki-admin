import React, { useEffect, useState } from 'react'
import { currency } from '../config'
import { toast } from 'react-toastify'
import EditModal from '../components/EditModal'
import axiosInstance from '../utils/axiosConfig'

const List = ({ token }) => {

  const [list, setList] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const fetchList = async () => {
    try {

      const response = await axiosInstance.get('/api/product/list')
      if (response.data.success) {
        setList(response.data.products.reverse());
      }
      else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {

      const response = await axiosInstance.post('/api/product/remove', { id })

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList();
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const openEditModal = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const closeEditModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>

        {/* ------- List Table Title ---------- */}

        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {/* ------ Product List ------ */}

        {
          list.map((item, index) => (
            <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
              <img className='w-12' src={item.image[0]} alt="" />
              <p 
                onClick={() => openEditModal(item)} 
                className="cursor-pointer hover:text-blue-600"
              >
                {item.name}
              </p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <div className='text-right md:text-center flex justify-center'>
                <span onClick={() => removeProduct(item._id)} className='cursor-pointer text-lg'>X</span>
              </div>
            </div>
          ))
        }

      </div>

      {/* Edit Modal */}
      <EditModal 
        isOpen={isModalOpen}
        onClose={closeEditModal}
        product={selectedProduct}
        token={token}
        onUpdate={fetchList}
      />
    </>
  )
}

export default List

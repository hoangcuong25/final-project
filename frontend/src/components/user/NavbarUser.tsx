import Image from 'next/image'
import React from 'react'
import air_bnb_logo from '@public/Airbnb_Logo.svg'
import { House, FerrisWheel, ConciergeBell, Globe, Menu, CircleHelp, Search } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const NavbarUser = () => {
    return (
        <div className='flex flex-col'>
            <div className='flex items-center justify-between'>
                <Image src={air_bnb_logo} width={100} height={100} alt='Logo' />

                <div className='flex items-center justify-between gap-8'>
                    <div className='w-36 h-10 bg-red-500 rounded-full flex items-center justify-evenly px-2'>
                        <House className='text-6xl text-white' />
                        <p className='text-white'>Nơi lưu chú</p>
                    </div>

                    <div className='w-40 h-10 bg-red-500 rounded-full flex items-center justify-evenly px-2'>
                        <FerrisWheel className='text-6xl text-white' />
                        <p className='text-white'>Trải nghiệm mới</p>
                    </div>

                    <div className='w-40 h-10 bg-red-500 rounded-full flex items-center justify-evenly px-2'>
                        <ConciergeBell className='text-6xl text-white' />
                        <p className='text-white'>Dịch vụ</p>
                    </div>
                </div>

                <div className='flex items-center justify-between gap-8'>
                    <p>Trở thành Host</p>

                    <div className='size-9 flex items-center justify-center rounded-full bg-gray-200 shadow-md'>
                        <Globe className='text-6xl' />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div className='size-9 flex items-center justify-center rounded-full bg-gray-200 shadow-md'>
                                <Menu className='text-6xl' />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='w-56 p-5'>
                            <div className='flex flex-col items-start justify-start text-sm'>
                                <div className='flex items-center justify-start gap-2 border-b border-gray-300 pb-5 w-full'>
                                    <CircleHelp className='text-xl' />
                                    <p className=''>Trung tâm trợ giúp</p>
                                </div>

                                <div className='flex items-center justify-start gap-2 border-b border-gray-300 py-5 w-full'>
                                    <div className='flex flex-col items-start justify-start'>
                                        <p className='font-semibold'>Trở thành host</p>
                                        <p className='text-xs'>Bắt đầu tiếp đón khác về và
                                            <br /> kiếm thêm thu nhập thật dễ dàng
                                        </p>
                                    </div>
                                </div>

                                <div className='pt-5 cursor-pointer'>
                                    <p className='font-semibold'>Đăng nhập</p>
                                    <p className='text-xs'>Để xem thông tin tài khoản của bạn</p>
                                </div>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className='flex items-center justify-center mt-5 text-sm '>
                <div className='border border-gray-300 rounded-full px-5 py-2 flex items-center justify-between'>
                    <div className='border-r border-gray-300 pr-5'>
                        <p>Địa điểm</p>
                        <p className='font-light'>Tìm kiếm theo địa điểm</p>
                    </div>

                    <div className='border-r border-gray-300 px-5'>
                        <p>Nhận Phòng</p>
                        <p className='font-light'>Thêm ngày</p>
                    </div>

                    <div className='border-r border-gray-300 px-5'>
                        <p>Trả Phòng</p>
                        <p className='font-light'>Thêm ngày</p>
                    </div>

                    <div className=' px-5 pr-10'>
                        <p>Khách</p>
                        <p className='font-light'>Thêm khách</p>
                    </div>

                    <div className='flex items-center justify-center bg-red-500 rounded-full  p-2'>
                        <Search className='text-white' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NavbarUser
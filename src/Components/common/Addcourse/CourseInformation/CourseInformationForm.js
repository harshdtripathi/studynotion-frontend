import React from 'react'
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { MdNavigateNext } from "react-icons/md"
import {
  addCourseDetails, editCourseDetails, fetchCourseCategories
} from '../../../../services/operations/CourseDetailsApis'
import { setStep, setCourse } from '../../../../slices/courseSlice';
import { COURSE_STATUS } from "../../../../utils/constants"
import IconBtn from "../../IconBtn"

import Upload from '../PublishCourse/Upload';
import ChipInput from "./ChipInput"
import RequirementsField from "./RequirementField"

const CourseInformationForm = () => {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
    handleSubmit
  } = useForm();

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth)
  const { course, editCourse } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)
  const [courseCategories, setCourseCategories] = useState([])

  useEffect(() => {
    console.log("fetching categories!!");
   
    const getCategories = async () => {
      setLoading(true);
      console.log("fetching categories!222");

      const categories = await fetchCourseCategories();
      console.log("fetching categories!!333");
      if (categories.length > 0) {
        console.log("fetching categories!!333444");
        setCourseCategories(categories)
      }
      console.log("fetching categories!!333444");
      setLoading(false)
      console.log("fetched the categories");
    }
    console.log("here is course",course);

    if (editCourse) {
      setValue("courseTitle", course.courseName)
      setValue("courseShortDesc", course.description)
      setValue("coursePrice", course.price)
      setValue("courseTags", course.tags)
      // setValue("courseBenefits", course.whatWillYouLearn)
      setValue("courseCategory", course.category)
      setValue("courseRequirements", course.instructions)
      setValue("courseImage", course.thumbnail)
    }
    getCategories();

  }, [])

  const isFormUpdated = () => {
    const currentValues = getValues();

    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags.toString() !== course.tags.toString() ||
      currentValues.courseBenefits !== course.whatWillYouLearn ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseRequirements.toString() !==
      course.instructions.toString() ||
      currentValues.courseImage !== course.thumbnail
    ) { return true }
    return false
  }

  const onSubmit = async (data) => {
    console.log("started");
    if (editCourse) {
      if (isFormUpdated()) {
        const currentValues = getValues()
        const formData = new FormData()
        formData.append("courseId", course._id)
        if (currentValues.courseTitle !== course.courseName) {
          formData.append("courseName", data.courseTitle)
        }
        if (currentValues.courseShortDesc !== course.courseDescription) {
          formData.append("description", data.courseShortDesc)
        }
        if (currentValues.coursePrice !== course.price) {
          formData.append("price", data.coursePrice)
        }
        if (currentValues.courseTags.toString() !== course.tags.toString()) {
          formData.append("tags", JSON.stringify(data.courseTags))
        }
        if (currentValues.courseBenefits !== course.whatWillYouLearn) {
          formData.append("whatWillYouLearn", data.courseBenefits)
        }
        if (currentValues.courseCategory._id !== course.category._id) {
          formData.append("category", data.courseCategory)
        }
        if (
          currentValues.courseRequirements.toString() !==
          course.instructions.toString()
        ) {
          formData.append(
            "instructions",
            JSON.stringify(data.courseRequirements)
          )
        }
        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnailImage", data.courseImage)
        }
        setLoading(true)
        const result = await editCourseDetails(formData, token)
        setLoading(false)
        console.log("Dispatching setStep...", result);
        
        if (result) {
          console.log("hii");
          dispatch(setStep(2));
          dispatch(setCourse(result))
        }
      }
      else {
        toast.error("No changes made to the form")
      }
      return
    }

    const formData = new FormData();
    formData.append("courseName", data.courseTitle)
    formData.append("courseDescription", data.courseShortDesc)
    formData.append("price", data.coursePrice)
    formData.append("tags", JSON.stringify(data.courseTags))
    // formData.append("whatWillYouLearn", data.courseBenefits)
    formData.append("category", data.courseCategory)
    formData.append("status", COURSE_STATUS.DRAFT)
    formData.append("instructions", JSON.stringify(data.courseRequirements))
    formData.append("thumbnailImage", data.courseImage)

    setLoading(true);
    console.log("hiii");

    const result = await addCourseDetails(formData, token);
    console.log('Add Course Result:', result);
    console.log("hiii33");
    
      dispatch(setStep(2));
      dispatch(setCourse(result))
    
    setLoading(false);

  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >
      {/* Course Title */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseTitle">
          Course Title <sup className="text-pink-200">*</sup>
        </label>
        <input
          id='courseTitle'
          placeholder='Enter Course Title'
          {...register("courseTitle", { required: true })}
          className='form-style w-full bg-richBlack-800 rounded-md'
        />
        {
          errors.courseTitle && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Course title is required
            </span>
          )
        }
      </div>

      {/* Course Description */}
      <div className='flex flex-col space-y-2'>
        <label htmlFor='courseShortDesc' className=' text-sm text-richblack-5'>
          Course Short Description <sup className=' text-pink-200'>*</sup>
        </label>
        <textarea id='courseShortDesc' placeholder='Enter Description'
          {...register("courseShortDesc", { required: true })}
          className='form-style resize-x-none min-h-[130px] w-full bg-richBlack-800 rounded-md'
        />
        {errors.courseShortDesc && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Description is required
          </span>
        )}
      </div>

      {/* Course Price */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="coursePrice">
          Course Price <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="coursePrice"
            placeholder="Enter Course Price"
            {...register("coursePrice", {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            className="form-style w-full !pl-12 bg-richBlack-800 rounded-md"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
        </div>
        {errors.coursePrice && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Price is required
          </span>
        )}
      </div>

      {/* Course Category DropDown */}
      <div className="flex flex-col space-y-2">
        <label htmlFor='courseCategory' className="text-sm text-richblack-5">
          Category <sup className="text-pink-200">*</sup>
        </label>

        <select
          id='courseCategory'
          defaultValue=""
          {...register("courseCategory", { required: true })}
          className='form-style w-full bg-richBlack-800 rounded-md'>
          <option value="" disabled>Choose a category</option>
          {
            !loading &&
            courseCategories.map((category, index) => (
              <option value={category?._id} key={index}>
                {category?.name}
              </option>
            ))
          }
        </select>
        {errors.courseCategory && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Category is required
          </span>
        )}
      </div>

      {/* Tags component */}
      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and Press Enter"
        register={register}
        setValue={setValue}
        getValues={getValues}
        errors={errors}
      />

      Upload Component
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />


      {/* Benefits of the course */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
          Benefits of the course <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Enter benefits of the course"
          {...register("courseBenefits", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full bg-richBlack-800 rounded-md py-3"
        />
        {errors.courseBenefits && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Benefits of the course is required
          </span>
        )}
      </div>
      {/* Requirements/Instructions */}
      <RequirementsField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />

      <div className='flex justify-end gap-2'>
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
          >
            Continue Without Saving
          </button>
        )}
        <button
  type="submit"
  disabled={loading}
  className={`w-20 h-10 flex items-center justify-center rounded-md transition-all ${
    loading ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-50 hover:bg-yellow-600"
  }`}
>
  <MdNavigateNext className={`text-xl ${loading ? "text-gray-600" : "text-black"}`} />
  <span className="ml-2 font-semibold text-black">
    {editCourse ? "Save Changes" : "Next"}
  </span>
</button>


      </div>
    </form>
  )
}

export default CourseInformationForm

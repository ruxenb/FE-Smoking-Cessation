import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, InputNumber, Button, Radio, Checkbox } from 'antd';
import moment from 'moment';
import { toast } from 'react-toastify';
import './QuitPlanForm.css';

const { TextArea } = Input;

function QuitPlanForm({ quitMethods, onSubmit, initialValues, loading }) {
    const [form] = Form.useForm();
    const [selectedMethodOptions, setSelectedMethodOptions] = useState([]);

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                startDate: initialValues.startDate ? moment(initialValues.startDate) : null,
                targetEndDate: initialValues.targetEndDate ? moment(initialValues.targetEndDate) : null,
            });
            if (initialValues.methodOptions) {
                setSelectedMethodOptions(initialValues.methodOptions.map(opt => opt.id));
            }
        }
    }, [initialValues, form]);

    const disabledStartDate = (current) => {
        return current && current.isBefore(moment().startOf('day'));
    };

    const disabledTargetEndDate = (current) => {
        const startDate = form.getFieldValue('startDate');
        return current && (current.isBefore(moment().endOf('day')) || (startDate && current.isBefore(startDate.endOf('day'))));
    };

    const handleGroupOrOptionChange = (methodId, optionId, isChecked) => {
        const parentMethod = quitMethods.find(method => method.id === methodId);
        if (!parentMethod) return;

        setSelectedMethodOptions(prevSelected => {
            let newSelected = [...prevSelected];

            if (parentMethod.methodType === 'SINGLE_CHOICE') {
                // Đảm bảo chỉ có 0 hoặc 1 option của nhóm này được chọn
                // Bước 1: Loại bỏ TẤT CẢ các options thuộc nhóm này ra khỏi newSelected
                const optionsFromThisGroup = parentMethod.options.map(opt => opt.id);
                newSelected = newSelected.filter(id => !optionsFromThisGroup.includes(id));

                // Bước 2: Nếu option mới đang được CHỌN, thêm nó vào newSelected
                if (isChecked) {
                    newSelected.push(optionId);
                }
                // Nếu option mới đang được BỎ CHỌN (nhấp lại vào chính nó),
                // thì không cần thêm lại, vì nó đã bị loại bỏ ở Bước 1.
                // Điều này giúp quản lý 0 hoặc 1 option.
            } else if (parentMethod.methodType === 'MULTIPLE_CHOICE') {
                // Đối với MULTIPLE_CHOICE: thêm hoặc xóa option
                if (isChecked) {
                    if (!newSelected.includes(optionId)) { // Tránh thêm trùng lặp
                        newSelected.push(optionId);
                    }
                } else {
                    newSelected = newSelected.filter(id => id !== optionId);
                }
            }
            return newSelected;
        });
    };

    const onFinish = (values) => {
        const methodOptionsForSubmission = selectedMethodOptions.map(optionId => {
            for (const method of quitMethods) {
                const foundOption = method.options.find(opt => opt.id === optionId);
                if (foundOption) {
                    return {
                        id: foundOption.id,
                        optionText: foundOption.optionText,
                        optionDescription: foundOption.optionDescription,
                        optionNoti: foundOption.optionNoti,
                        quitMethodId: foundOption.quitMethodId
                    };
                }
            }
            return null;
        }).filter(Boolean);

        const dataToSubmit = {
            ...values,
            startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
            targetEndDate: values.targetEndDate ? values.targetEndDate.format('YYYY-MM-DD') : null,
            methodOptions: methodOptionsForSubmission,
        };
        onSubmit(dataToSubmit);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={initialValues}
        >
            <Form.Item
                label="Reason for Quitting"
                name="reason"
                rules={[
                    { required: true, message: 'Please input your reason for quitting!' },
                    { min: 10, message: 'Reason must be at least 10 characters.' }
                ]}
            >
                <TextArea rows={4} placeholder="Why do you want to quit smoking?" />
            </Form.Item>

            <div className="date-pickers-row">
                <Form.Item
                    label="Start Date"
                    name="startDate"
                    rules={[{ required: true, message: 'Please select a start date!' }]}
                    // Thêm className cho Form.Item nếu muốn tùy chỉnh riêng từng cái
                    className="start-date-item" 
                >
                    <DatePicker
                        format="YYYY-MM-DD"
                        disabledDate={disabledStartDate}
                        placeholder="Select start date"
                        className="quit-plan-date-picker"
                        style={{ width: '100%' }} // Đảm bảo DatePicker chiếm hết chiều rộng của Form.Item
                    />
                </Form.Item>

                <Form.Item
                    label="Target End Date"
                    name="targetEndDate"
                    rules={[{ required: true, message: 'Please select a target end date!' }]}
                    // Thêm className cho Form.Item nếu muốn tùy chỉnh riêng từng cái
                    className="end-date-item"
                >
                    <DatePicker
                        format="YYYY-MM-DD"
                        disabledDate={disabledTargetEndDate}
                        placeholder="Select target end date"
                        className="quit-plan-date-picker"
                        style={{ width: '100%' }} // Đảm bảo DatePicker chiếm hết chiều rộng của Form.Item
                    />
                </Form.Item>
            </div>

            <Form.Item
                label="Cigarettes Smoked Daily (before quitting)"
                name="dailySmoke"
                rules={[
                    { required: true, message: 'Please input daily cigarette count!' },
                    { type: 'number', min: 0, message: 'Daily smoke count cannot be negative.' }
                ]}
            >
                <InputNumber min={0} placeholder="e.g., 20" style={{ width: '100%' }} />
            </Form.Item>

            <h3>Choose Your Quit Methods:</h3>
            {quitMethods.map(method => (
                <div key={method.id} className="quit-method-section">
                    <h4>{method.methodName}</h4>
                    {method.methodType === 'SINGLE_CHOICE' ? (
                        <Radio.Group
                            className="quit-options-group"
                            // Value của Radio.Group sẽ là ID của option được chọn duy nhất trong nhóm này.
                            // Ant Design sẽ tự động bỏ chọn radio cũ khi radio mới được chọn trong group.
                            value={
                                selectedMethodOptions.find(id =>
                                    method.options.some(opt => opt.id === id)
                                ) || null // Đảm bảo giá trị là null nếu không có gì được chọn trong nhóm này
                            }
                            // onChange của Radio.Group sẽ cung cấp giá trị mới của radio được chọn
                            onChange={(e) => {
                                handleGroupOrOptionChange(method.id, e.target.value, true); // true vì đây là hành động chọn
                            }}
                        >
                            {method.options.map(option => (
                                <div
                                    key={option.id}
                                    className={`quit-option-card ${selectedMethodOptions.includes(option.id) ? 'selected' : ''}`}
                                >
                                    <Radio value={option.id}>
                                        <strong>{option.optionText}</strong>
                                        <p>{option.optionDescription}</p>
                                    </Radio>
                                </div>
                            ))}
                        </Radio.Group>
                    ) : method.methodType === 'MULTIPLE_CHOICE' ? (
                        <Checkbox.Group
                            className="quit-options-group"
                            value={selectedMethodOptions.filter(id =>
                                method.options.some(opt => opt.id === id)
                            )}
                            onChange={(checkedValues) => {
                                // checkedValues là mảng các ID của options được chọn trong nhóm này
                                const currentOptionsInGroup = selectedMethodOptions.filter(id =>
                                    method.options.some(opt => opt.id === id)
                                );

                                // Các option mới được chọn
                                const newlyChecked = checkedValues.filter(id => !currentOptionsInGroup.includes(id));
                                if (newlyChecked.length > 0) {
                                    handleGroupOrOptionChange(method.id, newlyChecked[0], true); 
                                }

                                // Các option bị bỏ chọn
                                const newlyUnchecked = currentOptionsInGroup.filter(id => !checkedValues.includes(id));
                                if (newlyUnchecked.length > 0) {
                                    handleGroupOrOptionChange(method.id, newlyUnchecked[0], false); // Xử lý từng cái nếu muốn
                                }

                                // Cập nhật toàn bộ selectedMethodOptions dựa trên checkedValues mới của nhóm này
                                setSelectedMethodOptions(prevSelected => {
                                    // Giữ lại các option từ các nhóm khác
                                    const otherGroupOptions = prevSelected.filter(id =>
                                        !method.options.some(opt => opt.id === id)
                                    );
                                    return [...otherGroupOptions, ...checkedValues];
                                });
                            }}
                        >
                            {method.options.map(option => (
                                <div
                                    key={option.id}
                                    className={`quit-option-card ${selectedMethodOptions.includes(option.id) ? 'selected' : ''}`}
                                    // Bỏ onClick trên div
                                >
                                    <Checkbox value={option.id}>
                                        <strong>{option.optionText}</strong>
                                        <p>{option.optionDescription}</p>
                                    </Checkbox>
                                </div>
                            ))}
                        </Checkbox.Group>
                    ) : (
                        <p>Unsupported method type: {method.methodType}</p>
                    )}
                </div>
            ))}

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} className="submit-quit-plan-btn">
                    Save
                </Button>
            </Form.Item>
        </Form>
    );
}

export default QuitPlanForm;
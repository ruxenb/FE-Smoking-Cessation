import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  message, 
  Input, 
  Form, 
  Select, 
  Switch,
  App,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Typography
} from 'antd';
import { TrophyOutlined, StarOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import {
  fetchAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement
} from '../../services/achievementService';
import { getAdminDashboardStats } from '../../services/adminService';

const { Option } = Select;
const { Title } = Typography;

function AdminAchievementManagement() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const [achievementStats, setAchievementStats] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  const token = `Bearer ${localStorage.getItem("accessToken")}`;

  useEffect(() => {
    fetchData();
    fetchAchievementStats();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetchAchievements(token);
      setAchievements(res.data.data);
    } catch (error) {
      message.error("Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };

  const fetchAchievementStats = async () => {
    try {
      setStatsLoading(true);
      const res = await getAdminDashboardStats(token);
      if (res.data.status === 'success') {
        setAchievementStats(res.data.data.achievements || []);
      }
    } catch (error) {
      message.error("Failed to load achievement statistics");
      console.error(error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingAchievement(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Update the handleEdit function to properly set all form values
  const handleEdit = (achievement) => {
    setEditingAchievement(achievement);
    
    // Set all form fields with existing values
    form.setFieldsValue({
      name: achievement.name,
      icon: achievement.icon,
      description: achievement.description,
      category: achievement.category,
      ruleType: achievement.ruleType,
      targetValue: achievement.targetValue,
      comparisonOperator: achievement.comparisonOperator || ">=", // Default if not set
      iconType: achievement.iconType || "EMOJI", // Default if not set
      locked: achievement.locked || false // Default if not set
    });
    
    setModalVisible(true);
  };

  const handleDelete = (achievementId) => {
    modal.confirm({
      title: 'Delete Achievement',
      content: 'Are you sure you want to delete this achievement?',
      onOk: async () => {
        try {
          await deleteAchievement(achievementId, token);
          message.success('Achievement deleted successfully');
          fetchData();
          fetchAchievementStats(); // Refresh stats after deletion
        } catch (error) {
          message.error('Failed to delete achievement');
        }
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingAchievement) {
        await updateAchievement(editingAchievement.achievementId, values, token);
        message.success('Achievement updated successfully');
      } else {
        await createAchievement(values, token);
        message.success('Achievement created successfully');
      }
      
      setModalVisible(false);
      fetchData();
      fetchAchievementStats(); // Refresh stats after creation/update
    } catch (error) {
      message.error('Failed to save achievement');
    }
  };

  // Calculate achievement statistics
  const totalAchievements = achievements.length;
  const unlockedCount = achievementStats.reduce((sum, stat) => sum + stat.count, 0);
  const categoryStats = achievements.reduce((acc, achievement) => {
    acc[achievement.category] = (acc[achievement.category] || 0) + 1;
    return acc;
  }, {});

  const getCategoryColor = (category) => {
    switch(category) {
      case 'time': return 'blue';
      case 'financial': return 'gold';
      case 'health': return 'green';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'achievementId',
      key: 'id',
      width: 50,
      sorter: (a, b) => a.achievementId - b.achievementId,
    },
    {
      title: '',
      dataIndex: 'icon',
      key: 'icon',
      width: 40,
      render: (icon) => <span style={{ fontSize: '20px' }}>{icon}</span>
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      sorter: (a, b) => a.name.localeCompare(b.name),
      ellipsis: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 90,
      filters: [
        { text: 'Time', value: 'time' },
        { text: 'Financial', value: 'financial' },
        { text: 'Health', value: 'health' },
      ],
      onFilter: (value, record) => record.category === value,
      render: (category) => (
        <Tag color={getCategoryColor(category)} style={{ fontSize: '11px', margin: 0 }}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Target',
      dataIndex: 'targetValue',
      key: 'targetValue',
      width: 70,
      sorter: (a, b) => a.targetValue - b.targetValue,
    },
    {
      title: 'Rule',
      dataIndex: 'ruleType',
      key: 'ruleType',
      width: 120,
      render: (ruleType) => {
        const shortRuleType = ruleType
          .replace('DAYS_SMOKE_FREE', 'Days Free')
          .replace('MONEY_SAVED', 'Money')
          .replace('CIGARETTES_NOT_SMOKED', 'Cigarettes');
        return (
          <Tag color="purple" style={{ fontSize: '11px', margin: 0 }}>
            {shortRuleType}
          </Tag>
        );
      },
    },
    {
      title: 'Users',
      key: 'unlockedBy',
      width: 70,
      render: (_, record) => {
        const stat = achievementStats.find(s => s.name === record.name);
        return (
          <Tag color={stat?.count > 0 ? 'green' : 'orange'} style={{ fontSize: '11px', margin: 0 }}>
            {stat?.count || 0}
          </Tag>
        );
      },
      sorter: (a, b) => {
        const statA = achievementStats.find(s => s.name === a.name);
        const statB = achievementStats.find(s => s.name === b.name);
        return (statA?.count || 0) - (statB?.count || 0);
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button 
            type="link" 
            size="small"
            danger 
            onClick={() => handleDelete(record.achievementId)}
          >
            Del
          </Button>
        </Space>
      ),
    },
  ];

  // Achievement stats table columns
  const statsColumns = [
    { 
      title: 'Achievement', 
      dataIndex: 'name', 
      key: 'name',
      render: (text, record) => {
        const achievement = achievements.find(a => a.name === text);
        return (
          <span>
            {achievement?.icon && <span style={{ marginRight: 8, fontSize: '18px' }}>{achievement.icon}</span>}
            {text}
          </span>
        );
      }
    },
    { 
      title: 'Category',
      key: 'category',
      render: (_, record) => {
        const achievement = achievements.find(a => a.name === record.name);
        return achievement ? (
          <Tag color={getCategoryColor(achievement.category)}>
            {achievement.category.toUpperCase()}
          </Tag>
        ) : null;
      }
    },
    { 
      title: 'Unlocked By', 
      dataIndex: 'count', 
      key: 'count',
      render: count => <Tag color={count > 0 ? "green" : "orange"}>{count} users</Tag>,
      sorter: (a, b) => a.count - b.count,
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Achievement Statistics Overview */}
      <div style={{ marginBottom: 32 }}>
        <Title level={3} style={{ marginBottom: 24 }}>Achievement Statistics</Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Total Achievements"
                value={totalAchievements}
                prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Total Unlocks"
                value={unlockedCount}
                prefix={<UnlockOutlined style={{ color: '#52c41a' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Average per Achievement"
                value={totalAchievements > 0 ? (unlockedCount / totalAchievements).toFixed(1) : 0}
                prefix={<StarOutlined style={{ color: '#1890ff' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Categories</div>
                {Object.entries(categoryStats).map(([category, count]) => (
                  <Tag key={category} color={getCategoryColor(category)} style={{ margin: '2px' }}>
                    {category}: {count}
                  </Tag>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Achievement Statistics Table */}
      <Card style={{ marginBottom: 32 }} title="Achievement Unlock Statistics" hoverable>
        <Table
          columns={statsColumns}
          dataSource={achievementStats?.map((item, index) => ({
            ...item,
            key: item.id || item.name || index
          })) || []}
          loading={statsLoading}
          pagination={{ pageSize: 10 }}
          size="small"
          locale={{ emptyText: 'No achievement statistics available' }}
        />
      </Card>

      {/* Achievement Management Table */}
      <Card title="Achievement Management" hoverable>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Title level={4} style={{ margin: 0 }}>All Achievements</Title>
          <Button type="primary" onClick={handleCreate}>
            + Create Achievement
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={achievements}
          loading={loading}
          rowKey="achievementId"
          pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }}
          bordered
          size="small"
          scroll={{ x: 900 }}
        />
      </Card>

      {/* Update the Modal form with proper initial values and better field handling */}
      <Modal
        title={editingAchievement ? 'Edit Achievement' : 'Create Achievement'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnClose={false} // Changed to false to preserve form state
      >
        <Form 
          form={form} 
          layout="vertical" 
          preserve={true} // Changed to true to preserve form data
          initialValues={{
            comparisonOperator: ">=",
            iconType: "EMOJI",
            locked: false
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter achievement name' }]}
          >
            <Input placeholder="Enter achievement name" />
          </Form.Item>
          
          <Form.Item
            label="Icon"
            name="icon"
            rules={[{ required: true, message: 'Please enter icon emoji' }]}
          >
            <Input placeholder="🎯" maxLength={10} />
          </Form.Item>
          
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Describe what this achievement represents..."
              maxLength={500}
              showCount
            />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  <Option value="time">⏰ Time</Option>
                  <Option value="financial">💰 Financial</Option>
                  <Option value="health">🏥 Health</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Target Value"
                name="targetValue"
                rules={[
                  { required: true, message: 'Please enter target value' },
                  { 
                    validator: (_, value) => {
                      const numValue = Number(value);
                      if (isNaN(numValue) || numValue <= 0) {
                        return Promise.reject(new Error('Target must be greater than 0'));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input 
                  type="number" 
                  placeholder="e.g., 7" 
                  min={1}
                  addonAfter={
                    <Form.Item name="ruleType" noStyle>
                      <Select style={{ width: 120 }} placeholder="Unit">
                        <Option value="DAYS_SMOKE_FREE">Days</Option>
                        <Option value="MONEY_SAVED">VND</Option>
                        <Option value="CIGARETTES_NOT_SMOKED">Cigarettes</Option>
                      </Select>
                    </Form.Item>
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            label="Rule Type"
            name="ruleType"
            rules={[{ required: true, message: 'Please select rule type' }]}
          >
            <Select placeholder="Select achievement rule">
              <Option value="DAYS_SMOKE_FREE">
                <div>
                  <strong>Days Smoke Free</strong>
                  {/* <div style={{ fontSize: '12px', color: '#666' }}>
                    Track consecutive smoke-free days
                  </div> */}
                </div>
              </Option>
              <Option value="MONEY_SAVED">
                <div>
                  <strong>Money Saved</strong>
                  {/* <div style={{ fontSize: '12px', color: '#666' }}>
                    Track total money saved from not smoking
                  </div> */}
                </div>
              </Option>
              <Option value="CIGARETTES_AVOIDED">
                <div>
                  <strong>Cigarettes Not Smoked</strong>
                  {/* <div style={{ fontSize: '12px', color: '#666' }}>
                    Track total cigarettes avoided
                  </div> */}
                </div>
              </Option>
            </Select>
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Comparison"
                name="comparisonOperator"
                tooltip="How to compare user progress with target value"
              >
                <Select>
                  <Option value=">=">&gt;= (Greater than or equal)</Option>
                  <Option value=">">&gt; (Greater than)</Option>
                  <Option value="=">=== (Exactly equal)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Icon Type"
                name="iconType"
              >
                <Select>
                  <Option value="EMOJI">📱 Emoji</Option>
                  <Option value="IMAGE">🖼️ Image</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Status"
                name="locked"
                valuePropName="checked"
                tooltip="Locked achievements are not available to users"
              >
                <Switch 
                  checkedChildren="🔒 Locked" 
                  unCheckedChildren="🔓 Active"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      
      {contextHolder}
    </div>
  );
}

const AdminAchievementManagementPage = () => (
  <App>
    <AdminAchievementManagement />
  </App>
);

export default AdminAchievementManagementPage;
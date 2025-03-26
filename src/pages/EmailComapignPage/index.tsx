import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Layout, Table, Button, Input, Tag, Typography } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import CreateCampaignModal from "../../components/CampaignModal";
import { SERVER_URL } from "../../config";
import toast from "react-hot-toast";
import axios from "axios";
import CustomLoader from "../../commons/CustomLoader";

const { Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

export default function EmailCampaigns() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const token=localStorage.getItem("x-ai-sales-mail-token")
  // Status Tags
  const statusTag = (status: string) => {
    const color =
      status === "sent" ? "green" : status === "Scheduled" ? "blue" : "volcano";
    return <Tag color={color}>{status.toUpperCase()}</Tag>;
  };
  // Table Columns
  const columns = [
    {
      title: "Campaign Name",
      dataIndex: "campaignName",
      key: "campaignName",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => statusTag(status),
    },
    {
      title: "Emails Sent",
      dataIndex: "totalEmailSent",
      key: "totalEmailSent",
    },
    {
      title: "Open Rate",
      dataIndex: "totalEmailOpened",
      key: "totalEmailOpened",
      // @ts-expect-error bjk jh
      render: (_,rec) => `${(rec.totalEmailOpened/rec.totalEmailSent)*100}%`,
    },
    
  ];
  const [loading, setLoading] = useState(false);

  const fetchampaigns = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${SERVER_URL}/campaigns/getAll?page=${page}`,{headers:{
        Authorization: `Bearer ${token}` 
      }});
      setCampaigns(res.data.campaigns);
      setTotal(res.data.total);
    } catch (error: any) {
      console.error(
        "Error fetching email template:",
        error.response?.data || error.message
      );
      toast.error("Failed to fetch email templates.");
    } finally {
      setLoading(false);
    }
  };
useEffect(()=>{
  fetchampaigns()
},[page])

  return (
    <Layout>
      <Content className="p-6 bg-gray-100 min-h-screen">
        {/* Page Title & Button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-6"
        >
          <Title level={3} className="text-gray-800">
            Email Campaigns
          </Title>
        
          <Button type="primary"  icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>New Campaign</Button>
      <CreateCampaignModal visible={isModalOpen} onClose={() => {setIsModalOpen(false);fetchampaigns()}} />
    
        </motion.div>

        {/* Search Bar */}
        <Search
          placeholder="Search campaigns..."
          prefix={<SearchOutlined />}
          className="mb-4 w-full md:w-1/3"
        />

        {/* Email Campaigns Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* <Table columns={columns} dataSource={campaigns} /> */}
          <Table
  columns={columns}
  dataSource={campaigns}
  pagination={{
    current: page, 
    pageSize: 10, 
    total: total, 
    onChange: (page) => setPage(page),
    showTotal: (total, range) =>
      `Showing ${range[0]}-${range[1]} of ${total} campaigns`, 
  }}
  // loading={loading} 
/>
        </motion.div>
      </Content>
      
            {loading && <CustomLoader />}
    </Layout>
  );
}

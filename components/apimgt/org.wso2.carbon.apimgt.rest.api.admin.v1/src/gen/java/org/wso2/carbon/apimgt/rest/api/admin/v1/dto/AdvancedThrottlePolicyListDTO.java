package org.wso2.carbon.apimgt.rest.api.admin.v1.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModelProperty;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;


import javax.validation.Valid;



public class AdvancedThrottlePolicyListDTO   {
  
    private Integer count = null;
    private List<AdvancedThrottlePolicyInfoDTO> list = new ArrayList<AdvancedThrottlePolicyInfoDTO>();

  /**
   * Number of Advanced Throttling Policies returned. 
   **/
  public AdvancedThrottlePolicyListDTO count(Integer count) {
    this.count = count;
    return this;
  }

  
  @ApiModelProperty(example = "1", value = "Number of Advanced Throttling Policies returned. ")
  @JsonProperty("count")
  public Integer getCount() {
    return count;
  }
  public void setCount(Integer count) {
    this.count = count;
  }

  /**
   **/
  public AdvancedThrottlePolicyListDTO list(List<AdvancedThrottlePolicyInfoDTO> list) {
    this.list = list;
    return this;
  }

  
  @ApiModelProperty(value = "")
      @Valid
  @JsonProperty("list")
  public List<AdvancedThrottlePolicyInfoDTO> getList() {
    return list;
  }
  public void setList(List<AdvancedThrottlePolicyInfoDTO> list) {
    this.list = list;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    AdvancedThrottlePolicyListDTO advancedThrottlePolicyList = (AdvancedThrottlePolicyListDTO) o;
    return Objects.equals(count, advancedThrottlePolicyList.count) &&
        Objects.equals(list, advancedThrottlePolicyList.list);
  }

  @Override
  public int hashCode() {
    return Objects.hash(count, list);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class AdvancedThrottlePolicyListDTO {\n");
    
    sb.append("    count: ").append(toIndentedString(count)).append("\n");
    sb.append("    list: ").append(toIndentedString(list)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(java.lang.Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}

